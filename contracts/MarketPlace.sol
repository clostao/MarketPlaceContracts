// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MarketPlace {
  
  struct Product {
    string name;
    string description;
    bool selling;
    uint256 productId;
    address seller;
    address soldTo;
    uint256 price;
  }

  string name;

  uint256 nextProductId = 1;
  uint256 productsToSell = 0;

  mapping (uint256 => Product) products;

  event LogProductBought(uint256 productId);

  event LogProductInSell(Product product);
  

  constructor(string memory _name) {
    name = _name;
    nextProductId = 1;
  }

  function addProductToSell( 
    string memory _name,
    string memory _description,
    uint256 _price
    ) external {
      
    // Setting Product struct fields
    Product memory product = Product(_name, _description, true, nextProductId, msg.sender, address(0), _price);

    // Altering state
    products[nextProductId] = product;
    emit LogProductInSell(product);
    nextProductId = nextProductId + 1;
    productsToSell = productsToSell + 1;
  }

  function getProductsInSell() public view returns (Product[] memory) {
    uint j = 0;
    Product[] memory _products = new Product[](productsToSell);
    for (uint256 i = 1; i < nextProductId && j < productsToSell; i++) {
      if (products[i].selling == true) {
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
    require(products[productId].selling, "The article has already been sold.");
    require(products[productId].seller != msg.sender, "Seller and customer cannot be the same account.");
    require(products[productId].price == uint256(msg.value), "Price and tx value should meet.");
    require(products[productId].selling == true, "Product is not longer in sell");

    // Then we process the tx
    payable(products[productId].seller).transfer(products[productId].price);
    products[productId].selling = false;
    products[productId].soldTo = msg.sender;
    productsToSell = productsToSell - 1;

    // And emit the correspondant event
    emit LogProductBought(productId);

    return products[productId];
  }
  
}