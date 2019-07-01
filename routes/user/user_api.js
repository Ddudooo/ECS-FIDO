var express = require('express');
var appRoot = require('app-root-path');
// DB MODELS
var User = require(appRoot+'/models/user');
var jwt = require('jsonwebtoken');
var secretObj = require(appRoot+'/config/jwt');
var router = express.Router();



// url /user/api/

router.post('/login/', function (req, res, next) {
    //정상 데이터시 토큰 리턴
    console.log(req.body);
    User.find({
        id: req.body.id,
        pw: req.body.pw,
    }).then((users)=>{
        console.log(users);
        if(users.length ==1){
            // 로그인 성공시 jwt 발행
            let token = jwt.sign({// 토큰의 내용(payload)                
                id: users[0].id                   
              },
              secretObj.secret ,    // 비밀 키
              {
                expiresIn: '30m'    // 유효 시간은 5분
              });
            res.json({status:"success", token:token});
        }else{
            res.status(500);
            res.json({status:"fail"})
        }        
    }).catch((err)=>{
        console.error(err);
        res.status(500);
        res.json({status:"fail", msg:"please check server"});
    })    
});

router.post('/register/', function(req,res, next){
    // 정상 데이터시 토큰 리턴
    var newUser = new User({
        id: req.body.id,
        pw: req.body.pw,
    })

    newUser.save().then((result)=>{
        console.log(result);
        res.status(200);
        res.json({status:"success"});
        
    }).catch((err)=>{
        console.error(err);
        // next(err);
        res.status(500);
        res.json({status:'fail',msg:'already used id'});
    })    
});


router.post('/profile/', function(req,res, next){
    // 정상 데이터시 정보 리턴
    let token = req.body.token;
    let decoded = jwt.verify(token, secretObj.secret);
    if(decoded){
        //토큰 ok
        User.find({
            id: decoded.id,
        }).then((users)=>{
            if(users.length==1){
                res.status(200);
                res.json({status:"success", info: users[0]});                
            }else{
                res.status(500);
                res.json({status:"fail", msg: "not found profile"});
            }
        }).catch((err)=>{
            console.error(err);
            res.status(500);
            res.json({status:"fail", msg: "please check Server"});
        })
    }else{
        res.status(500);
        res.json({status:"fail"});
    }
});

router.post('/modify/', (req,res,next)=>{
    // 정상 데이터시 정보 변경후 status 값 리턴
    let token = req.body.token;
    let modify = req.body.modify;
    let decoded = jwt.verify(token, secretObj.secret);
    if(decoded){
        //토큰 ok
        User.find({
            id: decoded.id,
        }).then((users)=>{
            if(users.length==1){
                console.log(users[0].id)                
                User.update({id: users[0].id}, modify)
                .catch((err)=>{
                    console.error(err);
                    res.status(400);
                    res.json({status:"fail"})
                })
                res.status(200);
                res.json({status:"success"});
            }else{
                res.redirect('/user/logout/');
            }
        }).catch((err)=>{
            console.error(err);
            res.status(500);
            res.json({status:"fail", msg: "not found profile"});
        })
    }else{
        res.status(500);
        res.json({status:"fail"});
    }
});

router.post('/secssion/', (req,res,next)=>{
    // 정상 요청시 삭제후, status 값 리턴
    let token = req.body.token;
    let decoded = jwt.verify(token, secretObj.secret);
    if(decoded){
        //토큰 ok
        User.find({
            id: decoded.id
        }).then((users)=>{
            if(users.length==1){
                User.remove({
                    id:users[0].id
                }, (err, output)=>{
                    console.log(decoded.id+" DELETE");
                })
                res.status(200);
                res.json({status:"success"});                
            }else{
                res.redirect('/user/logout/');
            }
        }).catch((err)=>{
            console.error(err);
            res.status(500);
            res.json({status:"fail", msg: "not found profile"});
        })
    }else{
        res.status(500);
        res.json({status:"fail"});
    }
});

// router.post('/logout',function(req,res){ 
//     // 정상 데이터시, 토큰 유효기간 만료
// });


module.exports = router;