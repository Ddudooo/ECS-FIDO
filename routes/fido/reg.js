var express = require('express');
var base64url = require('base64url');
var regenerate = require('regenerate');
var router = express.Router();

// url /fido/reg/*

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('fido/webAuthn', { title: 'Fido Hackathon WebAuthn Test Web' });
});

router.post('/challenge', function(req, res, next){
    console.log("get userInfo");
    console.log(req.body);
    params = {
        "rp" : {
            "name" :"Test RP",
            "id" : "localhost"
        },
        "user" : {
            "name" : req.body.name,
            "id" : regenerate(base64url(req.body.name)),
            "displayName" : req.body.displayName , 
        },
        "authenticatorSelection" : {
            "authenticatorAttachment" : req.body.authnAttach,
            "requireResidentKey" : req.body.requireResKey,
            "userVerification" : req.body.userVerifiy
        },
        "attestation" : req.body.attestation
    };
    res.send(params);
});
module.exports = router;