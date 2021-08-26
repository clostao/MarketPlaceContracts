const HDWalletProvider = require('@truffle/hdwallet-provider');    


module.exports = {
  networks: {
    ganache: {
      host: "localhost",
      port: 7545,
      network_id: "*",
    },
    chainskills: {
      host: "localhost",
      port: 8545,
      network_id: "4224",
      gas: 4700000
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${projectId}`),
      network_id: 3,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    bscTestnet: {
      network_id: 0x61,
      host: "https://data-seed-prebsc-1-s1.binance.org",
      port: 8545
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  },
  mocha: {
    timeout: 60 * 60 * 1000
  }
};
