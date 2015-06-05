var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var urlencode = bodyParser.urlencoded({ extended: false });

// Redis connection
var redis = require('redis');
if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var client = redis.createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(":")[1]);
} else {
  var client = redis.createClient();
  client.select((process.env.NODE_ENV || 'development').length);
}
// End Redis Connection

router.route('')
  .get(function(request, response){
    client.hkeys('services', function (err, services) {
     response.json(services);
   });
  })

  .post(urlencode, function(request, response) {
    var service = request.body;
    client.hset('services', service.svcname, service.state);
    response.status(201).json("created new service: "+service.svcname);
  });

router.route('/about')
    .get(function(request, response) {
      response.send('About svcmgt');
    });

router.route('/:svcname')
  .get(function(request, response){
     var svcname = request.params.svcname;
     client.hget('services', svcname, function(error, state) {
       if(error) throw error;
       if (!state) {
         response.status(404).json("not found service name: " + svcname);
       } else {
         response.json("service:"+ svcname + ' state:' + state);
       }
     });
  })

  .delete(function(request, response) {
    var svcname = request.params.svcname;
    client.hdel('services', svcname, function (error, success) {
      if(error) throw error;
      if (success>0) {
        response.status(204).json("delete service name: " + svcname);
      } else {
        response.status(404).json("not found service name: " + svcname);
      }
    });
  });


module.exports = router;
