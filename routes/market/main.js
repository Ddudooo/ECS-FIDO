var express = require('express');
var appRoot = require('app-root-path');
// DB MODELS
var market = require(appRoot+'/models/concert');

var router = express.Router();



// url /market/

/* GET home page. */
router.get('', function (req, res, next) {

        res.render('market/main'); 
});

module.exports = router;