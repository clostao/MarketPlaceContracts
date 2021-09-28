// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract NFTManager {
  function safeTransferFrom(address, address, uint256) public virtual;
}

contract MarketPlace {
  
  struct Product {
    uint256 tokenId;
    address owner;
    bool sold;
    uint256 price;
    uint256 productId;
  }

  string name;

  address nftContract;
  uint256 nextProductId = 1;
  uint256 productsToSell = 0;

  mapping (uint256 => Product) products;

  event LogProductBought(uint256 productId);

  event LogProductInSell(Product product);
  

  constructor(string memory _name, address _contract) {
    nftContract = _contract;
    name = _name;
    nextProductId = 1;
  }

  function addProductToSell( 
    uint256 _tokenId,
    uint256 _price
    ) external {
      
    // Setting Product struct fields
    uint256 productId = nextProductId;
    Product memory product = Product(_tokenId, msg.sender, false, _price, productId);

    // Altering state
    products[productId] = product;
    emit LogProductInSell(product);
    nextProductId = nextProductId + 1;
    productsToSell = productsToSell + 1;

  }

  function getProductsInSell() public view returns (Product[] memory) {
    uint j = 0;
    Product[] memory _products = new Product[](productsToSell);
    for (uint256 i = 1; i < nextProductId && j < productsToSell; i++) {
      if (products[i].sold == false) {
        _products[j] = products[i];
        j++;
      }
    }
    return _products;
  }

  function getProduct(uint256 productId) public view returns (Product memory) {
    require(productId > 0 && productId < nextProductId, "Incorrect product id");
    return products[productId];
  }

  function buyProduct(uint256 productId) payable external returns(Product memory) {

    // Provided product exists in products array
    require(productId > 0 && productId < nextProductId, "Product doesn't exist");

    // If sell conditions are met
    require(!products[productId].sold, "The article has already been sold.");
    require(products[productId].owner != msg.sender, "Seller and customer cannot be the same account.");
    require(products[productId].price == uint256(msg.value), "Price and tx value should meet.");

    // Then we process the tx
    payable(products[productId].owner).transfer(products[productId].price);
    products[productId].sold = true;
    productsToSell = productsToSell - 1;

    // Transfer NFT
    NFTManager(nftContract).safeTransferFrom(products[productId].owner, msg.sender, products[productId].tokenId);

    // Changing owner
    products[productId].owner = msg.sender;

    // And emit the correspondant event
    emit LogProductBought(productId);

    return products[productId];
  }
  
}