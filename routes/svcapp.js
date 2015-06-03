var express = require('express');

var router = express.Router();

router.route('/')
  .get(function(request, response){
     response.send('Hello World!');
     // response.json(names);
     }
    );

module.exports = router;
