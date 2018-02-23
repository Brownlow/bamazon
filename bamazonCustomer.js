var inquirer = require('inquirer');
var mysql = require('mysql');

var stock = '';
var total = 0;


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  displayProducts();
});


function displayProducts(){
	var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
   	for (var i = 0; i < res.length; i++) {
     		console.log('\n\nProduct ID: ' + res[i].position + '\nProduct: ' + res[i].product_name + '\nPrice: ' + res[i].price);
   	}
   	placeOrder();
  });	
}

// Customer Place Order 
function placeOrder(){
	inquirer.prompt([
  	{
  	  	name: "whichId",
  	  	type: "input",
  	  	message: "What is the ID of the product you'd like to purchase?",
  	  	validate: function(value) {
      		if (isNaN(value) === false) {
      		  return true;
      		}
      		return false;
      	}
  	},
  	{
  	  	name: "howMany",
  	  	type: "input",
  	  	message: "How many would you like to purchase?",
  	  	validate: function(value) {
      		if (isNaN(value) === false) {
      		  return true;
      		}
      		return false;
      	}
  	}
  	]).then(function(answer) {

  		// Get selected products stock quantity
  		var query = "SELECT stock_quantity, price FROM products WHERE ?";
  		connection.query(query, {position:answer.whichId}, function(err, res) {	

  			// check if ordered amount is available
  			for(i=0; i<res.length; i++){
  				stock = res[i].stock_quantity
  			}
    	  if(stock < answer.howMany){
    	  	console.log('Not enough inventory');
    	  	placeOrder();
    	  } else{
    	  	console.log('Thank you for your purchase!');
    	  	updateInventory(answer, res);
    	  	updateSales(answer, res);
    	  	displayPrice(answer, res);
    	  	connection.end();
    	  }
  		});	
  	});
}

// Update Inventory
function updateInventory(answer, res){
	var query = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE position = ?"
  connection.query(query, [answer.howMany, answer.whichId], function(err, res) {
  });
}

// Update Sales
function updateSales(answer, res){
	total = parseInt(answer.howMany) * parseInt(res[0].price);
	var query = "UPDATE products SET product_sales = product_sales + ? WHERE position = ?"
  connection.query(query, [total, answer.whichId], function(err, res) {
  });
}

// Display Price
function displayPrice(answer, res){
	total = parseInt(answer.howMany) * parseInt(res[0].price);
	console.log('Your Total is: $' + total);

}
