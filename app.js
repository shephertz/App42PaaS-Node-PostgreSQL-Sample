
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var pg   = require('pg');
var app  = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Database URL and connection Object
var conString = "postgres://postgres:ankit1234@localhost:5432/nodedb_development";
var connection = new pg.Client(conString);

// Connect PostgreSQL
connection.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
});

// Database setup
connection.query("CREATE TABLE IF NOT EXISTS users(name varchar(128), email varchar(128), des varchar(256))");

// Add a new User
app.get("/users/new", function (req, res) {
  res.render("new", {
    title: 'App42PaaS Express MySql Application'
  });
});

// Save the Newly created User
app.post("/users", function (req, res) {
  var name=req.body.name;
  var email=req.body.email;
  var des=req.body.des;

  connection.query('INSERT INTO users (name,email,des) VALUES ($1,$2,$3) RETURNING id', [name, email, des], function(err, docs) {
    res.redirect('/');
  });
});

// Create Node server 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// App root
app.get('/', function(req, res){
  connection.query('SELECT * FROM users', function(err, docs) { 
    res.render('users', {users: docs, title: 'App42PaaS Express MySql Application'});
  });
});
