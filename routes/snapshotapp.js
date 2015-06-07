var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var urlencode = bodyParser.urlencoded({ extended: false });
var urljson = bodyParser.json({ extended: false });

var redis = require('redis');
if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var client = redis.createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(":")[1]);
} else {
  var client = redis.createClient();
  client.select((process.env.NODE_ENV || 'development').length);
}

router.route('/')
  .get(function(request, response){
    client.zrange('snapshots', 0, -1, function (err, snapshots) {
     response.json(snapshots);
   });
  })

  .post(urlencode, urljson, function(request, response) {
    var snapshot = request.body.dbserver + ":" + request.body.dbname;
    console.log("zadd snapshot:" + snapshot);
    client.zadd(['snapshots', 1, snapshot], function(err) {
        if (err) throw err;
        response.status(201).json({dbserver:request.body.dbserver, dbname:request.body.dbname});
      });
  });

router.route('/about')
    .get(function(request, response) {
      response.send('About svcmgt');
    });

router.route('/:snapshot')
  .get(function(request, response){
     var snapshot = request.params.snapshot;
     client.sget('snapshots-state', snapshot, function(error, state) {
       if(error) throw error;
       if (!state) {
         response.status(404).json("not found snapshot: " + snapshot);
       } else {
         response.json("snapshot:"+ snapshot + ' state:' + snapshot);
       }
     });
  })

  .delete(function(request, response) {
    var snapshot = request.params.snapshot;
    client.zrem('snapshots', snapshot, function (error, success) {
      if(error) throw error;
      if (success>0) {
        response.status(204).json("delete snapshot name: " + snapshot);
      } else {
        response.status(404).json("not found snapshot name: " + snapshot);
      }
    });
  });


module.exports = router;
