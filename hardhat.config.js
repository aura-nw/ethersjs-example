const fs = require('fs');
const privateKey = fs.readFileSync('.secret').toString().trim();

require('@nomicfoundation/hardhat-toolbox');
require('hardhat-gas-reporter');
require('hardhat-deploy');

module.exports = {
  solidity: "0.8.10",
  settings: {
    optimizer: {
        enabled: true,
        runs: 200
    }
  },
  defaultNetwork: 'hardhat',
  networks: {
    local: {
        url: 'http://127.0.0.1:8545'
    },
    hardhat: {
        blockGasLimit: 7000000
    },
    evtestnet: {
        url: 'https://evmos-testnet-jsonrpc.alkadeta.com/',
        chainId: 9000,
        throwOnTransactionFailures: true,
        gasPrice: 10000000000,
        accounts: [privateKey],
        gas: 4000000,
        timeout: 120000,
        allowUnlimitedContractSize: true
    },
    evmainnet: {
        url: 'https://evmos-jsonrpc.alkadeta.com/',
        chainId: 9001,
        gas: 4000000,
        accounts: [privateKey],
        timeout: 120000,
        throwOnTransactionFailures: true,
        gasPrice: 10000000000
    },
    audevnet: {
        url: 'https://jsonrpc.dev.aura.network/',
        chainId: 1235,
        gas: 4000000,
        accounts: [privateKey],
        timeout: 120000,
        throwOnTransactionFailures: true,
        gasPrice: 10000000000
    },
  },
  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
    },
  },
  paths: {
    deploy: 'scripts',
    deployments: 'deployments'
  }
};
