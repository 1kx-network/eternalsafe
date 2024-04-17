import { useEffect } from 'react'
import { initSafeSDK, setSafeImplementation, setSafeSDK } from '@/hooks/coreSDK/safeCoreSDK'
import { trackError } from '@/services/exceptions'
import ErrorCodes from '@/services/exceptions/ErrorCodes'
import { useAppDispatch } from '@/store'
import { showNotification } from '@/store/notificationsSlice'
import { useMultiWeb3ReadOnly } from '@/hooks/wallets/web3'
import { asError } from '@/services/exceptions/utils'
import useSafeAddress from '@/hooks/useSafeAddress'
import { bytes32ToAddress } from '@/utils/addresses'
import type Safe from '@safe-global/safe-core-sdk'
import type { Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import useChainId from '@/hooks/useChainId'

export const getSafeImplementation = async (web3: Provider, safeAddress: string, chainId: string) => {
  return web3
    .getNetwork()
    .then((network) => {
      if (network.chainId == Number(chainId)) {
        return web3.getCode(safeAddress)
      } else {
        throw {
          skip: true,
        }
      }
    })
    .then((code) => {
      if (code !== '0x') {
        return web3.getStorageAt(safeAddress, 0)
      } else {
        throw new Error(`No Safe found at address ${safeAddress} on chain with ID ${chainId}.`)
      }
    })
}

export const getSafeSDKAndImplementation = async (
  web3: Provider,
  safeAddress: string,
  chainId: string,
): Promise<[Safe, string]> => {
  const implementation = await getSafeImplementation(web3, safeAddress, chainId)
  if (!implementation || implementation === ethers.constants.HashZero) {
    throw new Error(`Nothing set on storage slot 0 in ${safeAddress}.`)
  }

  let implementationAddress = bytes32ToAddress(implementation)
  let sdk = await initSafeSDK({
    provider: web3,
    chainId,
    address: safeAddress,
    implementation: implementationAddress,
  })

  return [sdk, implementationAddress]
}

export const useInitSafeCoreSDK = () => {
  const dispatch = useAppDispatch()
  const web3ReadOnly = useMultiWeb3ReadOnly()
  const address = useSafeAddress()
  const chainId = useChainId()

  useEffect(() => {
    if (!web3ReadOnly || !address || !chainId) {
      // If we don't reset the SDK, a previous Safe could remain in the store
      setSafeImplementation(undefined)
      setSafeSDK(undefined)
      return
    }

    getSafeImplementation(web3ReadOnly, address, chainId)
      .then((impl) => {
        if (!impl || impl === ethers.constants.HashZero) {
          throw new Error(`Nothing set on storage slot 0 in ${address}.`)
        }

        let implementation = bytes32ToAddress(impl)
        setSafeImplementation(implementation)

        // A read-only instance of the SDK is sufficient because we connect the signer to it when needed
        return initSafeSDK({
          provider: web3ReadOnly,
          chainId,
          address,
          implementation,
        })
      })
      .then(setSafeSDK)
      .catch((_e) => {
        if (_e.skip) return

        setSafeImplementation(undefined)
        setSafeSDK(undefined)

        const e = asError(_e)
        dispatch(
          showNotification({
            message:
              'Please try connecting your Safe again. Ensure the address, chain and RPC URL are correct. If you see this error often, please consider using a more stable RPC URL.',
            groupKey: 'core-sdk-init-error',
            variant: 'error',
            detailedMessage: e.message,
          }),
        )
        trackError(ErrorCodes._105, e.message)
      })
  }, [dispatch, address, chainId, web3ReadOnly])
}
