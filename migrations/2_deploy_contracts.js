var MarketPlace = artifacts.require("./MarketPlace.sol");
const { log } = require('console');
var NFT = require('../build/contracts/MyNFT.json');

module.exports = function(deployer) {
  deployer.deploy(MarketPlace, "FirstMarketPlace", "0x38a676D492f504d5279f09d244F873c01264ee4a");
};
