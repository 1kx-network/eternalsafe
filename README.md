# WIP: Eternal Safe

[![License](https://img.shields.io/github/license/eternalsafe/wallet)](https://github.com/eternalsafe/wallet/blob/eternal-safe/LICENSE)
![Tests](https://img.shields.io/github/actions/workflow/status/eternalsafe/wallet/unit-tests.yml?branch=eternal-safe&label=tests)

Eternal Safe is a decentralized fork of [Safe{Wallet}](https://github.com/safe-global/safe-wallet-web), forked at v1.27.0. Funded by the [Safe Grants Program](https://app.charmverse.io/safe-grants-program/page-005239065690887612).

## Differences from Safe{Wallet}

- No analytics/tracking
- No backend services needed, only an RPC URL
- Easily runs on IPFS or locally

## Contributing

Contributions, be it a bug report or a pull request, are very welcome. Please check our [contribution guidelines](CONTRIBUTING.md) beforehand.

## Getting started with local development

### Environment variables

Create a `.env` file with environment variables. You can use the `.env.example` file as a reference.

Here's the list of all the environment variables:

| Env variable                                 | Description                                                                   |
| -------------------------------------------- | ----------------------------------------------------------------------------- |
| `NEXT_PUBLIC_IS_PRODUCTION`                  | Set to `true` to build a minified production app                              |
| `NEXT_PUBLIC_SAFE_VERSION`                   | The latest version of the Safe contract, defaults to 1.3.0                    |
| `NEXT_PUBLIC_WC_PROJECT_ID`                  | [WalletConnect v2](https://docs.walletconnect.com/2.0/cloud/relay) project ID |
| `NEXT_PUBLIC_TENDERLY_ORG_NAME`              | [Tenderly](https://tenderly.co) org name for Transaction Simulation           |
| `NEXT_PUBLIC_TENDERLY_PROJECT_NAME`          | Tenderly project name                                                         |
| `NEXT_PUBLIC_TENDERLY_SIMULATE_ENDPOINT_URL` | Tenderly simulation URL                                                       |

If you don't provide some of the variables, the corresponding features will be disabled in the UI.

### Running the app locally

Install the dependencies:

```bash
yarn
```

Run the development server:

```bash
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Lint

ESLint:

```
yarn lint --fix
```

Prettier:

```
yarn prettier
```

## Tests

Unit tests:

```
yarn test --watch
```

## Component template

To create a new component from a template:

```
yarn cmp MyNewComponent
```

## Frameworks

This app is built using the following frameworks:

- [Safe Core SDK](https://github.com/safe-global/safe-core-sdk)
- Next.js
- React
- Redux
- MUI
- ethers.js
- web3-onboard

### Notes

- Need to use the [`legacy-safe-core-sdk`](https://github.com/safe-global/safe-core-sdk/tree/legacy-safe-core-sdk) branch, as that's what the web app depended on at time of fork.
