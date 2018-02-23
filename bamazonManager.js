var inquirer = require('inquirer');
var mysql = require('mysql');

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
  displayOptions();
});

// Display Options
function displayOptions(){
	inquirer.prompt([
  	{
  	  	name: "options",
  	  	type: "list",
  	  	message: "What would you like to do?",
  	  	choices: [
  	  		"View Products for Sale",
  	  		"View Low Inventory",
  	  		"Add to Inventory",
  	  		"Add New Product",
  	  	]
  	}
  	]).then(function(answer) {

  		switch(answer.options){

  			case "View Products for Sale":
  				viewProducts();
  				break;

  			case "View Low Inventory":
  				viewLowInventory();
  				break;

  			case "Add to Inventory":
  				addInventory();
  				break;

  			case "Add New Product":
  				addProduct();
  				break;
  		}
  	});	
}

// View All Products
function viewProducts(){
	var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
   	for (var i = 0; i < res.length; i++) {
     	console.log('\n\nProduct ID: ' + res[i].position + '\nProduct: ' + res[i].product_name + '\nPrice: ' + res[i].price + '\nNumber in Stock: ' + res[i].stock_quantity);
   	}
   	displayOptions();
  });	
}

// View Items With Low Inventory
function viewLowInventory(){
	var lowstock = 0;
	var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
   	for (var i = 0; i < res.length; i++) {
   		if(res[i].stock_quantity < 5){
   			console.log('\nThere are only ' + res[i].stock_quantity + ' ' + res[i].product_name + ' left in stock\n');
   			lowstock++
   		}    	
   	}
   	if(lowstock === 0){
   		console.log('\n----------------------------------'); 
   		console.log('All products are well stocked Bossman'); 
   		console.log('----------------------------------'); 
   	}
   	displayOptions();
  });	
}

// Add Inventory
function addInventory(){
	inquirer.prompt([
  	{
  	  name: "whichId",
  	  type: "input",
  	  message: "Select the ID of the product you'd like to add inventory for?",
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
  	  message: "How many would you like to add?",
  	  validate: function(value) {
      	if (isNaN(value) === false) {
      	  return true;
      	}
      	return false;
      }
  	}
  	]).then(function(answer) {
  		var query = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE position = ?"
  		connection.query(query, [answer.howMany, answer.whichId], function(err, res) {
  			console.log('\nInventory Updated!');
  		});
  		setTimeout(displayOptions , 500);
  	});
  	
}

function addProduct(){
	inquirer.prompt([
  	{
  	  name: "product_name",
  	  type: "input",
  	  message: "What product would you like to add?",
  	},
  	{
  	  name: "category",
  	  type: "input",
  	  message: "What category of product is this?",
  	},
  	{
  	  name: "price",
  	  type: "input",
  	  message: "What is the price of this item?",
  	},
  	{
  	  name: "inventory",
  	  type: "input",
  	  message: "How many do you have in stock?",
  	},
  	{
  	  name: "sales",
  	  type: "input",
  	  message: "How much in sales?",
  	}

  	]).then(function(answer) {
  		var query = "INSERT products SET product_name = ?, department_name = ?, price = ?, stock_quantity = ?, product_sales = ?"
  		connection.query(query, [answer.product_name, answer.category, answer.price, answer.inventory, answer.sales], function(err, res) {
  			console.log('\nProduct Name: ' + answer.product_name + '\nProduct Department: ' + answer.category + '\nProduct Price: ' + answer.price + '\nNumber Available: ' + answer.inventory + '\nSales: ' + answer.sales);
  			console.log('\nProduct Added!');
  		});
  		setTimeout(displayOptions , 500);
  	});
}

