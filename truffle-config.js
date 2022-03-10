require('babel-register');
require('babel-polyfill');
require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider-privkey');
const privateKey = process.env.PRIVATE_KEY || "";
const infuraProjectId = process.env.INFURA_PROJECT_ID;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    kovan:{
      provider: () => new HDWalletProvider(privateKey.split(','), "https://kovan.infura.io/v3/" + infuraProjectId),
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
    }
  },
  mocha:{},
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: '0.8.11',
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
