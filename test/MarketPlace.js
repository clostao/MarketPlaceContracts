const { expect } = require('chai');
var MarketPlace = artifacts.require('./MarketPlace.sol');

contract('MarketPlace Smart Contract Testing', function (_accounts) {
    let nftContract = new web3.eth.Contract(require('../build/contracts/MyNFT.json').abi, "0x38a676D492f504d5279f09d244F873c01264ee4a");
    it('Basic tests: Products === [], at init time', function (done) {
        MarketPlace.deployed().then(function (instance) {
            instance.getProductsInSell().then(function (products) {
                assert.equal(products.length, 0, "Products list should be empty.");
                done();
            });
        });
    });
    let nftIds = [];
    it('Publishing sell offer to nfts: ProduceN.ID = N - 1', function (done) {
        MarketPlace.deployed().then(async function (_instance) {
            instance = _instance;
            for (var i = 0; i < 3; i++) {
                console.log(`Minting NFTs`);
                await nftContract.methods.mint().send({from: _accounts[0], gas: 830000}).then(e => nftIds.push(e.events.Transfer.returnValues.tokenId));
                console.log(`Approving the smart contract to manage their NFTs`);
                await nftContract.methods.approve(_instance.contract._address, nftIds[i]).send({from: _accounts[0]});
                console.log(`Adding products: ${i}`);
                await instance.addProductToSell(nftIds[i], web3.utils.toWei('4', 'ether'), {from: _accounts[0]}).catch(e => console.error("Error adding product."));
                console.log(`Get products: ${i}`);
                await instance.getProductsInSell().then(function (products) {
                    console.log(products.map(e => e.tokenId));
                    assert.equal(products.length, i + 1, "products length should be " + (i + 1));
                    assert.equal(products[i].tokenId, nftIds[i], "product_id should be " + nftIds[i]);
                });
            }
            done();
            
        });
    });
    it('Selling products: ProduceN.ID = N - 1', function (done) {
        MarketPlace.deployed().then(async function (_instance) {
            instance = _instance;
            for (var i = 0; i < 3; i++) {
                console.log(`Selling products: ${i}`);
                await instance.buyProduct(i + 1, {from: _accounts[1], value: web3.utils.toWei('4', 'ether') });
                console.log(`Get products: ${i}`);
                await instance.getProductsInSell().then(function (products) {
                    assert.equal(products.length, 2 - i, "products length should be " + (i + 1));
                });
            }
            done();
            
        });
    });
});