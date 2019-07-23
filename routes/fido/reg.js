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
            "name" : "ecs-rp",
            "id": "www.ecs-fido.com"
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
        "attestation": req.body.authenticatorSelection.attestation 
    };
    console.log("params >>> ");
    console.log(params);
    const options = {
        uri: 'https://prod-fido-fido2-server.line-apps.com/server/fido2/reg/challenge',
        method: 'POST',
        body: params,
        json: true
    };
    request.post(options, function(error,response,body){
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage
        if(response && response.statusCode == 200){
	    delete body.serverResponse;
	    body.status="ok";
	    body.attestation=params.attestation;
	    res.cookie('sessionId', body.sessionId);
            res.send(body);
        }else{
            res.send(body);
        }
    });

        
});

router.post('/attestation/result', (req,res, next)=>{
    console.log("POST '/fido/reg/attestation/result' \n");
    console.log(req.body);
    let sessionId = req.cookies.sessionId;
    console.log("\nsessionId ");
    console.log(sessionId);
    console.log("\n");
    param = {
	    origin: req.headers['origin'],
	    serverPublicKeyCredential: req.body,
	    sessionId: sessionId,
	    rpId: "www.ecs-fido.com"
    };
    const options ={
	    uri: 'https://prod-fido-fido2-server.line-apps.com/server/fido2/reg/response',
	    method:'POST',
	    body: param,
	    json: true
    };
    request.post(options, (error, response, body)=>{
	    console.log("========================================================================");
	    console.log('error:', error);//print error
	    console.log("========================================================================");
	    console.log('statusCode : ', response && response.statusCode);
	    console.log("________________________________________________________________________");
	    console.log('body : ' , body);
	    console.log("________________________________________________________________________");
	    if( response && response.statusCode == 200){
		    body.status = 'ok';
		    res.send(body);
	    }else{
		    res.send(body);
	    }
    });
    console.log("attestation/result");
});

module.exports = router;
