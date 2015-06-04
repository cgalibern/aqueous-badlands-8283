var express = require('express');
var app = express();

app.use(express.static(__dirname + '/static'));

var svcapp = require('./routes/svcapp');
var nodeapp = require('./routes/nodeapp');
app.use('/svcmgt', svcapp);
app.use('/nodes', nodeapp);

module.exports = app;
