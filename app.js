var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var svcapp = require('./routes/svcapp');
app.use('/svcs', svcapp);
app.use('/', svcapp);

module.exports = app;
