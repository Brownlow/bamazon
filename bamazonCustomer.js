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
  		var query = "SELECT stock_quantity FROM products WHERE ?";
  		connection.query(query, {position:answer.whichId}, function(err, res) {	

  			// check if ordered amount is available
  			var stock = '';

  			for(i=0; i<res.length; i++){
  				stock = res[i].stock_quantity
  			}

    	  	if(stock < answer.howMany){
    	  		console.log('Not enough inventory');
    	  		placeOrder();
    	  	} else{
    	  		console.log('Purchased');
    	  		updateInventory(answer, res);
    	  	}
  		});	
  	});
}

// 
function updateInventory(answer, res){
	var query = "UPDATE products SET res.stock_quantity = res.stock_quantity - answer.howMany WHERE ?";
  	connection.query(query, {position:answer.whichId}, function(err, res) {	
      	console.log(res);
  	});
}

//SELECT answer.whichId IF stock_quantity < answer.howMany, res.stock_quantity - answer.howMany, console.log('not enough inventory');

