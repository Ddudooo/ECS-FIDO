var express = require('express');
var base64url = require('base64url');
var regenerate = require('regenerate');
var request = require('request');


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
    // 사용자 데이터 검증 후 
    const params={
        "rp": {
            "name" : "ECS-FIDO",
            "id": "ecs-fido.com"
        },
        "user": {
            "name": req.body.username,
            "id": req.session.id,
            "displayName": req.body.displayName
        },
        "authenticatorSelection": {
            "authenticatorAttachment": req.body.authenticatorSelection.authenticatorAttachment,
            "requireResidentKey": req.body.authenticatorSelection.requireResidentKey,
            "userVerification": req.body.authenticatorSelection.userVerification
        },
        "attestation": "direct"
    }

    const options = {
        uri: 'https://prod-fido-fido2-server.line-apps.com/attestation/options',
        method: 'POST',
        form: req.body,
        json: true
    };
    request.post(options, function(error,response,body){
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage
        if(response && response.statusCode == 200){
            res.send(body);
        }else{
            res.send(body);
        }
    });

    // data = {
    //     "serverResponse": {
    //         "internalError": "SUCCESS",
    //         "internalErrorCode": 0
    //     },
    //     "rp": {
    //         "name": "Test RP",
    //         "id": "localhost"
    //     },
    //     "user": {
    //         "name": req.body.username,
    //         "id": req.session.id,
    //         "displayName": req.body.displayName
    //     },
    //     "challenge": "이건 무슨 값을 줘야하는거지",
    //     "pubKeyCredParams": [{
    //             "type": "public-key",
    //             "alg": -65535
    //         },
    //         {
    //             "type": "public-key",
    //             "alg": -257
    //         },
    //         {
    //             "type": "public-key",
    //             "alg": -258
    //         },
    //         {
    //             "type": "public-key",
    //             "alg": -259
    //         },
    //         {
    //             "type": "public-key",
    //             "alg": -37
    //         },
    //         {
    //             "type": "public-key",
    //             "alg": -38
    //         },
    //         {
    //             "type": "public-key",
    //             "alg": -39
    //         },
    //         {
    //             "type": "public-key",
    //             "alg": -7
    //         },
    //         {
    //             "type": "public-key",
    //             "alg": -35
    //         },
    //         {
    //             "type": "public-key",
    //             "alg": -36
    //         },
    //         {
    //             "type": "public-key",
    //             "alg": -8
    //         },
    //         {
    //             "type": "public-key",
    //             "alg": -43
    //         }
    //     ],
    //     "timeout": 50000,
    //     "excludeCredentials": [],
    //     "authenticatorSelection": {
    //         "authenticatorAttachment": req.body.authenticatorSelection.authenticatorAttachment,
    //         "requireResidentKey": req.body.authenticatorSelection.requireResidentKey,
    //         "userVerification": req.body.authenticatorSelection.userVerification
    //     },
    //     "attestation": "direct",
    //     "sessionId": req.session.id,
    //     "status" : "ok"
    // };
    // console.log(data);
    // res.send(data);
    
});
module.exports = router;