var express = require('express');
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
    // 로그인 시 login값을 id로 session 저장 
    req.session.login=req.body.userId; 
    res.redirect('/user/login/');
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