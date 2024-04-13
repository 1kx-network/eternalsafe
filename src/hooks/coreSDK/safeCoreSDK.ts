import chains from '@/config/chains'
import { getWeb3ReadOnly } from '@/hooks/wallets/web3'
import { _safeDeployments, _safeL2Deployments } from '@safe-global/safe-deployments'
import ExternalStore from '@/services/ExternalStore'
import { Gnosis_safe__factory } from '@/types/contracts'
import { invariant } from '@/utils/helpers'
import type { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import Safe from '@safe-global/safe-core-sdk'
import type { SafeVersion } from '@safe-global/safe-core-sdk-types'
import EthersAdapter from '@safe-global/safe-ethers-lib'
import type { SafeInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { ethers } from 'ethers'
import semverSatisfies from 'semver/functions/satisfies'

export const isLegacyVersion = (safeVersion: string): boolean => {
  const LEGACY_VERSION = '<1.3.0'
  return semverSatisfies(safeVersion, LEGACY_VERSION)
}

export const isValidSafeVersion = (safeVersion?: SafeInfo['version']): safeVersion is SafeVersion => {
  const SAFE_VERSIONS: SafeVersion[] = ['1.3.0', '1.2.0', '1.1.1', '1.0.0']
  return !!safeVersion && SAFE_VERSIONS.some((version) => semverSatisfies(safeVersion, version))
}

// `assert` does not work with arrow functions
export function assertValidSafeVersion<T extends SafeInfo['version']>(safeVersion?: T): asserts safeVersion {
  return invariant(isValidSafeVersion(safeVersion), `${safeVersion} is not a valid Safe Account version`)
}

export const createEthersAdapter = (provider: Web3Provider) => {
  const signer = provider.getSigner(0)
  return new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  })
}

export const createReadOnlyEthersAdapter = (provider = getWeb3ReadOnly()) => {
  if (!provider) {
    throw new Error('Unable to create `EthersAdapter` without a provider')
  }

  return new EthersAdapter({
    ethers,
    signerOrProvider: provider,
  })
}

type SafeCoreSDKProps = {
  provider: JsonRpcProvider
  chainId: SafeInfo['chainId']
  address: SafeInfo['address']['value']
  implementation: SafeInfo['implementation']['value']
}

// Safe Core SDK
export const initSafeSDK = async ({
  provider,
  chainId,
  address,
  implementation,
}: SafeCoreSDKProps): Promise<Safe | undefined> => {
  const safeVersion = await Gnosis_safe__factory.connect(address, provider).VERSION()

  let isL1SafeMasterCopy = chainId === chains.eth

  const masterCopy = implementation

  isL1SafeMasterCopy =
    Object.values(
      _safeDeployments.find((deployment) => deployment.version === safeVersion)?.networkAddresses ?? {},
    ).find((networkAddresses) => networkAddresses === masterCopy) !== undefined
  const isL2SafeMasterCopy =
    Object.values(
      _safeL2Deployments.find((deployment) => deployment.version === safeVersion)?.networkAddresses ?? {},
    ).find((networkAddresses) => networkAddresses === masterCopy) !== undefined

  // Legacy Safe contracts
  if (isLegacyVersion(safeVersion)) {
    isL1SafeMasterCopy = true
  } else if (!isL1SafeMasterCopy && !isL2SafeMasterCopy) {
    //TODO(devanon): Allow user to use it anyway
    throw new Error(`Unknown Safe implementation: ${masterCopy}`)
  }

  return Safe.create({
    ethAdapter: createReadOnlyEthersAdapter(provider),
    safeAddress: address,
    isL1SafeMasterCopy,
  })
}

export const {
  getStore: getSafeSDK,
  setStore: setSafeSDK,
  useStore: useSafeSDK,
} = new ExternalStore<Safe | undefined>()

export const {
  getStore: getSafeImplementation,
  setStore: setSafeImplementation,
  useStore: useSafeImplementation,
} = new ExternalStore<string | undefined>()
