var express = require('express');
var router = express.Router();

router.route('/')
  .get(function(request, response){
     response.send('Welcome in Node World!');
     // response.json(names);
     }
    );

module.exports = router;
