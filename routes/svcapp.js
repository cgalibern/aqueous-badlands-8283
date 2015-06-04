var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var urlencode = bodyParser.urlencoded({ extended: false });

var services = [ "svc0", "svc1"]

router.route('')
  .get(function(request, response){
     response.json(services);
  })

  .post(urlencode, function(request, response) {
    var service = request.body;
    services.push(service.svcname);
    response.status(201).json("created new service: "+service.svcname);
  });

router.route('/about')
    .get(function(request, response) {
      response.send('About svcmgt');
    });

router.route('/:id')
  .get(function(request, response){
     var id = request.params.id;
     if (!services[id]) { response.status(404).json('not found');}
     else { response.json("service id "+ id + ': ' + services[id]);}
  })

  .delete(function(request, response) {
    var id = request.params.id;
    if (services[id]=="") { response.status(404).json('not found');}
    services.splice(id, 1);
    response.status(204).json("delete service id: "+id);
    });



module.exports = router;
