var inquirer = require('inquirer');
var mysql = require('mysql');
var cTable = require('console.table');

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

function displayOptions(){
inquirer.prompt([
  {
    name: "options",
    type: "list",
    message: "What would you like to do?",
    choices: [
    	"View Product Sales by Department",
    	"Create New Department",
    ]
  }
  ]).then(function(answer) {

  	switch(answer.options){

  		case "View Product Sales by Department":
  			viewSalesByDept();
  			break;

  		case "Create New Department":
  			createDepartment();
  			break;
  	}
  });
}

function viewSalesByDept(){
	
  	var departmentTotals = 0;
  	// var query = "SELECT * FROM products";
  	var query = "SELECT * FROM products FULL OUTER JOIN departments ON products.department_name=departments.department_name"
  	connection.query(query, function(err, res) {
   		for (var i = 0; i < res.length; i++) {
   			departmentTotals = departmentTotals + res[i].product_sales;
   			console.table(res[i]);
   		}
   		//console.log('\n' + res.department_name + ' sales are $' + departmentTotals + '\n');
   		
  	});
  	setTimeout(displayOptions , 500);

// SELECT o.OrderID, o.OrderDate, c.CustomerName
// FROM Customers AS c, Orders AS o
// WHERE c.CustomerName="Around the Horn" AND c.CustomerID=o.CustomerID;
// GROUP BY Country;

//SELECT * FROM products JOIN INNER JOIN departments ON products.department_name=departments.department_name;


  	
}

function createDepartment(){
	inquirer.prompt([
  	{
  	  name: "department_name",
  	  type: "input",
  	  message: "Name this new department",
  	},
  	{
  	  name: "overhead_costs",
  	  type: "input",
  	  message: "What is overhead for this department?",
  	}
  	]).then(function(answer) {
  		var query = "INSERT departments SET department_name = ?, overhead_costs = ?"
  		connection.query(query, [answer.department_name, answer.overhead_costs], function(err, res) {
  			console.log('\nNew Department Added!');
  			console.log('-----------------------');
  			console.log('Department Name: ' + answer.department_name + '\nDepartment Overhead: ' + answer.overhead_costs + '\n');
  			setTimeout(displayOptions , 500);

  		});
  		
  	});
	
}