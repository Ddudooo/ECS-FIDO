var express = require('express');
var base64url = require('base64url');
var regenerate = require('regenerate');
var request = require('request');
var crypto = require('crypto');
var cryptoRandomString = require('crypto-random-string');
var appRoot = require('app-root-path');
var fidoUser = require(appRoot+'/models/fidoUser');
var router = express.Router();


router.post('/challenge', function (req, res, next) {
    console.log("POST '/fido/auth/challenge'");
    req.body.rpId = "www.ecs-fido.com";
    fidoUser.findOne({
        name : req.body.username,
        state : "CONFIRM"
    }).exec((err,user)=>{
        if(err||!user){
            console.log(req.body.username);
            console.log("not found exception");
            res.status(500).json({status:"fail"});
            return;
        }        
        req.body.id = user.credentialId;
        console.log("=============================================================");
        console.log(req.body);
        console.log("=============================================================");
        const options = {
            uri: 'https://prod-fido-fido2-server.line-apps.com/server/fido2/auth/challenge',
            method: 'POST',
            body: req.body,
            json: true
        };
        request.post(options, function(error,response,body){
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log("_____________________________________________________________");
            console.log('body:', body); // Print the HTML for the Google homepage
            console.log("_____________________________________________________________");
            if(response && response.statusCode == 200){
                if(body.serverResponse.internalError === 'SUCCESS'){
                    //let counter =0;
                    delete body.serverResponse;
                    //body.allowCredentials.push({
                    //    type : "public-key",
                    //    id : crypto.createHash('sha256').update(req.body.username).digest('base64')
                    //});
                    body.allowCredentials.push({
                        type: "public-key",
                        id : Buffer.from(req.body.id).toString('base64') 
                    });
                    body.status="ok";
                    res.cookie('sessionId', body.sessionId);
                    delete body.sessionId;
                    console.log(body);
                    res.send(body);
                }
                else{
                    res.send(body);
                    return;
                }
            }else{
                res.send(body);
            }
        });        
    });    
});

module.exports = router;
