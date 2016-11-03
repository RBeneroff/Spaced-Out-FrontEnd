// MODULES
// ==================================
var express = require('express');
var path = require('path');
var logger = require('morgan');
var app = express();

// MIDDLEWARE / CONFIGURATION
// ==================================
app.use(logger('dev'));
app.use(express.static(path.join(__dirname,'public')))

app.use('/scripts', express.static(__dirname + '/bower_components'))

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(4000, function() {
  console.log('listening ---> 4000');
});
