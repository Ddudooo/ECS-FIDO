var express = require('express');
var appRoot = require('app-root-path');
// DB MODELS
var User = require(appRoot+'/models/user');

var router = express.Router();



// url /qrcode/test

/* GET home page. */
router.get('/login/', function (req, res, next) {
    // 세션값이 있으면 
    if(req.session.login) {
        res.render('user/testLoginResult'); 
    } else { 
        // 없으면 로그인 페이지로 이동 
        res.render('user/login'); 
    }
});

router.post('/login/', function (req, res, next) {
    var loginUser = new User(req.body)

    User.find({
        id: req.body.userId,
        pw: req.body.userPw,
    }).then((users)=>{
        console.log(users);
        if(users.length ==1){
            // 로그인 시 login값을 id로 session 저장 
            req.session.login=req.body.userId;

            res.redirect('/user/login/');
        }else{
            res.render('user/login',{status:"fail", msg: "fail to login"});
        }        
    }).catch((err)=>{
        console.error(err);
        res.render('user/login',{status:"fail", msg: "error to login"});
    })
    
});

router.get('/register/', function(req,res, next){
    if(req.session.login) {
        res.render('user/testLoginResult'); 
    } else { 
        // 없으면 가입 페이지로 이동 
        res.render('user/register'); 
    }
})

router.post('/register/', function (req, res, next) {
    var newUser = new User({
        id: req.body.userId,
        pw: req.body.userPw,
    })

    newUser.save().then((result)=>{
        console.log(result);
        res.status(200);
        res.redirect('/user/login/');
        
    }).catch((err)=>{
        console.error(err);
        // next(err);
        res.render('user/register',{status:'fail',msg:'already used id'})
    })    
});

router.get('/mypage/', function(req,res, next){
    User.find({
        id: req.session.login,
    }).then((users)=>{
        if(users.length==1){
            res.render('user/mypage',users[0]);
        }else{
            res.redirect('/user/logout/');
        }
    }).catch((err)=>{
        console.error(err);
        res.redirect('/user/logout/');
    })
});

router.post('/mypage/modify', (req,res,next)=>{
    User.find({
        id: req.session.login,
    }).then((users)=>{
        if(users.length==1){
            console.log(users[0].id)
            console.log(users[0].pw +" >> " + req.body.userPw);
            User.update({id: users[0].id}, {
                pw: req.body.userPw,
                //email: req.body.email,                
            }).catch((err)=>{
                console.error(err);
            })
            res.redirect('/user/mypage/');
        }else{
            res.redirect('/user/logout/');
        }
    }).catch((err)=>{
        console.error(err);
        res.redirect('/user/logout/');
    })
});

router.post('/cancle/membership', (req,res,next)=>{
    console.log(req.session.login +" cancle membership");
    User.find({
        id: req.session.login,
        pw: req.body.userPw,
    }).then((users)=>{
        if(users.length==1){
            User.remove({
                id:users[0].id
            }, (err, output)=>{
                req.session.destroy(function(err){
                    if(err){ 
                        console.log(err); 
                    } else {
                        res.redirect('/'); 
                    } 
                }); 
                res.redirect('/');
            })
            
        }else{
            res.redirect('/user/logout/');
        }
    }).catch((err)=>{
        console.error(err);
        res.redirect('/user/logout/');
    })
});

router.get('/logout',function(req,res){ 
    // 로그아웃 시 세션 삭제 
    req.session.destroy(function(err){
        if(err){ 
            console.log(err); 
        } else {
            res.redirect('/'); 
        } 
    }); 
});


module.exports = router;