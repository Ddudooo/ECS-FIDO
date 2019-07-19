var express = require('express');

var router = express.Router();

// url /app-test/

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(req.query);
   res.json({"data":req.query});
});

router.post('/', function (req, res, next) {
    console.log(req.body);
   res.json({"data":req.body});
});

module.exports = router;