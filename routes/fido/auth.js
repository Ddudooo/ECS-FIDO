var express = require('express');
var base64url = require('base64url');
var regenerate = require('regenerate');
var router = express.Router();


router.post('/challenge', function (req, res, next) {
    console.log(req.body);
    res.send("test challenge");
});

module.exports = router;
