// Demo server app - developed for Gamification demo .... 
// This will expose some sample APIs via REST to call product database 

// import express module - web app server
// import body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body as something easier to interact with
// import mysql modeule to connect to mysql

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require("mysql");

// set port
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';





// we will use JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
	
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'Following APIs supported - /api/status/ ; /api/getproducts/' })
});


//mysql configuration - Gamification project mysql connect details
var mysqlHost = process.env.OPENSHIFT_MYSQL_DB_HOST || 'custom-mysql.gamification.svc.cluster.local';
var mysqlPort = process.env.OPENSHIFT_MYSQL_DB_PORT || 3306;
var mysqlUser = 'xxuser'; 
var mysqlPass = 'welcome1';

// we will use sampledb as database
var mysqlDb = 'sampledb';

//form the connection string to connect to mysql - you can connect directly too 
var mysqlString = 'mysql://' + mysqlUser + ':' + mysqlPass + '@' + mysqlHost + ':' + mysqlPort + '/' + mysqlDb;
console.log(mysqlString);


//connect to mysql/sampledb database
var mysqlClient = mysql.createConnection(mysqlString);
mysqlClient.connect(function (err) {
    if (err) console.log(err);
});

//GET DB STATUS - To validate if database is running call this API ... URL/isdbon
app.get('/api/status/db', function (req, res) {
    mysqlClient.query('SELECT 0 + 0 AS status', function (err, rows, fields) {
        if (err) {
            res.send('MYSQL IS NOT CONNECTED' + JSON.stringify(err));
        } else {
            res.send('MYSQL IS CONNECTED - Status Msg: ' + rows[0].status);
        }
    });
});

//GET ALL PRODUCTS - To retrieve all all products call this API ... URL/api/getproducts
app.get('/api/getproducts',(req, res) => {
let sql = "SELECT * FROM XXIBM_PRODUCT_SKU";  
console.log(sql);
  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
    //res.send(JSON.stringify({"status": 200, "error": null, "response":results}));
    res.send(JSON.stringify({ "response":results}));
  });
});

//GET A PRODUCT by DESCRIPTION ... To retrieve all all products call this API ... URL/api/getproducts/'Description'
app.get('/api/getproducts/desc/:desc',(req, res) => {
  let sql = "SELECT * FROM XXIBM_PRODUCT_SKU WHERE DESCRIPTION LIKE '%" + req.params.desc + "%'";
  console.log(sql);
  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//GET A PRODUCT by PRODUCT_ID ... To retrieve all all products call this API ... URL/api/getproducts/'Product_id'
app.get('/api/getproducts/id/:id',(req, res) => {
  let sql = "select sku.item_number, sku.description, sku.long_description ,sku_attribute1,sku_attribute_value1, sku_attribute2,sku_attribute_value2,  price.list_price, discount from XXIBM_PRODUCT_CATALOGUE cat,XXIBM_PRODUCT_SKU sku, XXIBM_PRODUCT_PRICING price where cat.commodity=sku.catalogue_category and sku.item_number = price.item_number and price.item_number="+req.params.id;
  console.log(sql);
  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//GET PRODUCT PRICE by PRODUCT_ID ... To retrieve product price call this API ... URL/api/getproducts/price/'Product_id'
app.get('/api/getproducts/price/:id',(req, res) => {
  let sql = "SELECT ITEM_NUMBER,LIST_PRICE FROM XXIBM_PRODUCT_PRICING WHERE ITEM_NUMBER="+req.params.id;
  console.log(sql);
  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//Get All Categories

app.get('/api/getallcategory',(req, res) => {
let sql = "SELECT * FROM XXIBM_PRODUCT_STYLE";  
console.log(sql);
  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
    //res.send(JSON.stringify({"status": 200, "error": null, "response":results}));
    res.send(JSON.stringify({ "response":results}));
  });
});

//GET A PRODUCT by CATEGORY... To retrieve all products call this API ... URL/api/getproductscat/'Description'
app.get('/api/getproductscat/cat/:cat',(req, res) => {
  let sql = "select sku.item_number, sku.description, sku.long_description ,sku_attribute1,sku_attribute_value1, sku_attribute2,sku_attribute_value2,  price.list_price, discount from XXIBM_PRODUCT_STYLE style, XXIBM_PRODUCT_SKU sku, XXIBM_PRODUCT_PRICING price where style.catalogue_category =sku.catalogue_category and sku.item_number = price.item_number and style.CATALOGUE_CATEGORY = " + req.params.cat;
  console.log(sql);
  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});


//GET A PRODUCT by PRODUCT_ID ... To retrieve all all products call this API ... URL/api/getproducts/'Product_id'
app.get('/api/getproducts/search/:searchtext',(req, res) => {
  let sql = "select sku.item_number, sku.description, sku.long_description ,sku_attribute1,sku_attribute_value1, sku_attribute2,sku_attribute_value2,  price.list_price, discount from XXIBM_PRODUCT_CATALOGUE cat,XXIBM_PRODUCT_SKU sku, XXIBM_PRODUCT_PRICING price where cat.commodity=sku.catalogue_category and sku.item_number = price.item_number and sku.description LIKE '%" + req.params.searchtext + "%'";
  console.log(sql);
  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//rest api to create a new customer record into mysql database
app.post('/api/adduser', function (req, res) {
   var params  = req.body;
   console.log(params);
   connection.query('INSERT INTO auth_user SET ?', params, function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});


//GET A PRODUCT by CATEGORY... To retrieve all products call this API ... URL/api/getproductscat/'Description'
app.get('/api/getproductsbrand/brand/:brand',(req, res) => {
  let sql = "select sku.item_number, sku.description, sku.long_description ,sku_attribute1,sku_attribute_value1, sku_attribute2,sku_attribute_value2,  price.list_price, discount from XXIBM_PRODUCT_STYLE style, XXIBM_PRODUCT_SKU sku, XXIBM_PRODUCT_PRICING price where style.catalogue_category =sku.catalogue_category and sku.item_number = price.item_number and style.brand = "+req.params.brand;
  console.log(sql);
  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

// set port
app.listen(port, ip);

module.exports = app;
