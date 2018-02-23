DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  position INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10, 2) NULL,
  stock_quantity INT NULL,
  product_sales DECIMAL(10,2) NULL,
  PRIMARY KEY (position)
);

CREATE TABLE departments(
  id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NULL,
  overhead_costs INT NULL,
  PRIMARY KEY (id)
);


SELECT * FROM products;
SELECT * FROM departments;