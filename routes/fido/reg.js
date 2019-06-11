var express = require('express');
var base64url = require('base64url');
var regenerate = require('regenerate');
var router = express.Router();

// url /fido/reg/*

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('fido/webAuthn', {
        title: 'Fido Hackathon WebAuthn Test Web'
    });
});

router.post('/challenge', function (req, res, next) {
    console.log("get Register Challenge");
    console.log(req.body);
    data = {
        "serverResponse": {
            "internalError": "SUCCESS",
            "internalErrorCode": 0
        },
        "rp": {
            "name": "Test RP",
            "id": "localhost"
        },
        "user": {
            "name": req.body.name,
            "id": req.session.id,
            "displayName": req.body.displayName
        },
        "challenge": "이건 무슨 값을 줘야하는거지",
        "pubKeyCredParams": [{
                "type": "public-key",
                "alg": -65535
            },
            {
                "type": "public-key",
                "alg": -257
            },
            {
                "type": "public-key",
                "alg": -258
            },
            {
                "type": "public-key",
                "alg": -259
            },
            {
                "type": "public-key",
                "alg": -37
            },
            {
                "type": "public-key",
                "alg": -38
            },
            {
                "type": "public-key",
                "alg": -39
            },
            {
                "type": "public-key",
                "alg": -7
            },
            {
                "type": "public-key",
                "alg": -35
            },
            {
                "type": "public-key",
                "alg": -36
            },
            {
                "type": "public-key",
                "alg": -8
            },
            {
                "type": "public-key",
                "alg": -43
            }
        ],
        "timeout": 50000,
        "excludeCredentials": [],
        "authenticatorSelection": {
            "authenticatorAttachment": req.body.authenticatorAttachment,
            "requireResidentKey": req.body.userVerification,
            "userVerification": req.body.userVerification
        },
        "attestation": "direct",
        "sessionId": req.session.id,
        "status" : "ok"
    };
    console.log(data);
    res.send(data);
});
module.exports = router;