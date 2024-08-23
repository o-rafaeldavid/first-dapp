# RealEstate Contracts | Hardhat

## Observation

-   Any command should be run on the root of the project
-   This Hardhat project is runned with Typescript

## Index

-   [Compiling and Testing](#compiling-and-testing)
-   [Deploy Contracts](#deploy-contracts)

## Compiling and Testing

### Compiling

All contracts should be present at [`/contracts`](./contracts) folder

When contracts are ready to be tested, or changed, run

```shell
npx hardhat compile
```

### Testing

All tests should be present at [`/test`](./test) folder

to test all tests, run

```shell
npx hardhat test
```

if you want to test just one (for example [RealEstate test](./test/RealEstate.ts)) you should do

```shell
npx hardhat test test/RealEstate.ts
```

## Deploy Contracts

### Run node

No run a local node run

```shell
npx hardhat node
```

Copy [`./artifacts/contracts/RealEstate.sol/RealEstate.json`](./artifacts/contracts/RealEstate.sol/RealEstate.json) abi list to [`client/src/utils/RealEstate_ABI.json`](../client/src/utils/RealEstate_ABI.json)
