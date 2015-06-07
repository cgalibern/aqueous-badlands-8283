var express = require('express');
var app = express();

app.use(express.static(__dirname + '/static'));

var svcapp = require('./routes/svcapp');
var nodeapp = require('./routes/nodeapp');
var snapshotapp = require('./routes/snapshotapp');

app.use('/svcmgt', svcapp);
app.use('/nodes', nodeapp);
app.use('/snapshots', snapshotapp);
app.get('/', function(request, response){
  response.redirect(301, '/angular-snapshots');  
});

module.exports = app;
