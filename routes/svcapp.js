var express = require('express');
var router = express.Router();

router.route('')
  .get(function(request, response){
     response.json('svcone');
  });

router.route('/:id')
  .get(function(request, response){
     response.json("service id "+ request.params.id);
  });

router.route('/about')
  .get(function(request, response) {
    response.send('About svcmt');
  });

module.exports = router;
