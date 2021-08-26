const fs = require('fs')
const { expect } = require('chai');
var MarketPlace = artifacts.require('./MarketPlace.sol');

contract('MarketPlace Smart Contract Testing', function (_accounts) {
    it('Basic tests: Products === [], at init time', function (done) {
        MarketPlace.deployed().then(function (instance) {
            instance.getProductsInSell().then(function (products) {
                assert.equal(products.length, 0, "Products list should be empty.");
                done();
            });
        });
    });
    it('Basic test: ProductN.ID = N - 1',  function (done) {
        MarketPlace.deployed().then(async function (_instance) {
            instance = _instance;
            for (var i = 0; i < 3; i++) {
                await instance.addProductToSell("selling one article", "article", web3.utils.toWei('4', 'ether'), {from: _accounts[0]}).then(function () {
                    return instance.getProductsInSell().then(function (products) {
                        assert.equal(products.length, i + 1, "products length should be " + (i + 1));
                        assert.equal(products[i].productId, i + 1, "product_id should be " + i);
                    });
                });
            }
            done();
            
        });
    });
    var ended = false;
    it('Complex tests: Three products bought', function (done) {
        MarketPlace.deployed().then(async function (_instance) {
            instance = _instance;
            for (var i = 0; i < 3; i++) {
                await instance.getProductsInSell().then(function (products) {
                    assert.equal(products.length, 3 - i, `i = ${i}, products length should be ${3 - i}`);
                    assert.equal(products.slice(-1)[0].productId, 3 - i, `i = ${i}, product_id should be ${3 - i}`);
                });

                let err = await instance.buyProduct(3 - i, { from: _accounts[1], value: web3.utils.toWei('4', 'ether')}).then(e => null).catch(function(err) {
                    if (!ended) done(`Iteracion ${i}: ${err}`);
                    return err;
                });
                if (err) return done("Error");
            }
            if (!ended) done();
            ended = false;
        });
    });
    it('Complex tests: Five products in sell one product bought', function (done) {
        MarketPlace.deployed().then(async function (_instance) {
            instance = _instance;
            for (var i = 0; i < 5; i++) {
                await instance.addProductToSell("selling one article", "article", web3.utils.toWei('4', 'ether'), {from: _accounts[0]}).catch(function (err) {
                    if (!ended) done(`Iteracion ${i}: ${err}`);
                    ended = true;
                });
            }
            let err = await instance.buyProduct(6, { from: _accounts[1], value: web3.utils.toWei('4', 'ether')}).then(() => false).catch(function(err) {
                if (!ended) done(`Iteracion ${i}: ${err}`);
                return true;
            });
            if (err) return;
            await instance.getProductsInSell().then(products => {
                expect(products.map(e => e.productId)).to.be.deep.equal(["4","5","7","8"]);
            });
            if (!ended) done();
        });
    });
});