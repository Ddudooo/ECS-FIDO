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
        req.body.userId = user.id;
        // req.body.credentialId = user.credentialId;
        // req.body.aaguid = user.aaguid;
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
                   
                    body.status="ok";
                    res.cookie('sessionId', body.sessionId);
                    user.sessionId = body.sessionId
                    user.save()
                        .then((fidouser)=>{
                            console.log("SESSIONID Update");
                            delete body.sessionId;
                            console.log(body);
                            res.send(body);
                        })
                        .catch((err)=>{
                            console.error(err);
                            res.status(500).json({status:"fail"});
                        });
                    
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

router.post('/assertion/result', (req,res, next)=>{
    console.log("POST '/fido/auth/assertion/result'");
    sessionId = req.cookies.sessionId;
    fidoUser.findOne({
        sessionId : sessionId
    }).exec((err,user)=>{
        if(err||!user){
            res.status(500).json({status:"fail",msg:"sessionId not found"});
            return;
        }
        req.body.response.userHandle = user.id;
        console.log("USER ID = "+user.id);
        console.log("RESPONSE ID = " +req.body.response.userHandle);
        param = {
            origin: req.headers['origin'],
            serverPublicKeyCredential: req.body,
            sessionId: sessionId,
            rpId: "www.ecs-fido.com"
        };
        const options ={
            uri: 'https://prod-fido-fido2-server.line-apps.com/server/fido2/auth/response',
            method:'POST',
            body: param,
            json: true
        };
        console.log(param);
        request.post(options, (error, response, body)=>{
            console.log("========================================================================");
            console.log('error:', error);//print error
            console.log("========================================================================");
            console.log('statusCode : ', response && response.statusCode);
            console.log("________________________________________________________________________");
            console.log('body : ' , body);
            console.log("________________________________________________________________________");
            if( response && response.statusCode == 200 && body.serverResponse.internalError == 'SUCCESS'){            
                body.status = 'ok';
                res.send(body);            
    
            }else{
                res.status(500).send(body);
            }
        });
    })
});

module.exports = router;
