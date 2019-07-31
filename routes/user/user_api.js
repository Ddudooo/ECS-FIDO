/**
 * @swagger
 * tags:
 *  name: User
 *  description : 테스트용 유저 JWT 발급용
 */

var express = require('express');
var appRoot = require('app-root-path');
// DB MODELS
var User = require(appRoot+'/models/user');
var jwt = require('jsonwebtoken');
var secretObj = require(appRoot+'/config/jwt');
var router = express.Router();



// url /user/api/
/**
 * @swagger
 * /user/api/login/:
 *  post:
 *      summary : 아이디, 패스워드로 로그인
 *      tags : [User]
 *      produces : 
 *          - application/json
 *      parameters :
 *          -   in : body
 *              name : user
 *              description : 유저 생성용
 *              schema:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: string
 *                      pw : 
 *                          type : string                 
 *                  example:
 *                      id: test
 *                      pw: "1234"
 *      responses :
 *          200 :
 *              schema :
 *                  type : object
 *                  properties:
 *                      status :
 *                          type : string                           
 *                      token : 
 *                          type : string
 * 
 */
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
/**
 * @swagger
 * /user/api/register/:
 *  post:
 *      summary : 아이디, 패스워드로 가입<br>
 *                테스트용으로 현재 중복체크 X 로 인한 기존 내용 덮어씌워짐 > 중복방지 추가
 *      tags : [User]
 *      produces : 
 *          - application/json
 *      parameters :
 *          -   in : body
 *              name : user
 *              description : 유저 생성용
 *              schema:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: string
 *                      pw : 
 *                          type : string                 
 *                  example:
 *                      id: test
 *                      pw: "1234"
 *      responses :
 *          200 :
 *              schema :
 *                  type : object
 *                  properties:
 *                      status :
 *                          type : string                          
 */
router.post('/register/', function(req,res, next){
    // 정상 데이터시 토큰 리턴
    var query = {
        id: req.body.id
    };
    User.find(query)
        .then((result)=>{
            if(result.length>=1){
                res.status(500).json({status:"fail", msg: 'already used id'});
                return;
            }else{
                query.pw = req.body.pw;
                let newUser = new User(query);
                newUser.save()
                        .then((saveUser)=>{
                            console.log(saveUser);
                            res.status(200).json({status:"success"});
                        });
            }
        })
        .catch((err)=>{
            console.error(err);
            res.status(500).json({status:"fail",msg:err});
            return;
        });
    // newUser.save().then((result)=>{
    //     console.log(result);
    //     res.status(200);
    //     res.json({status:"success"});
        
    // }).catch((err)=>{
    //     console.error(err);
    //     // next(err);
    //     res.status(500);
    //     res.json({status:'fail',msg:'already used id'});
    // })    
});

/**
 * @swagger
 * /user/api/profile/:
 *  post:
 *      summary : 토큰으로 정보 확인
 *      tags : [User]
 *      produces : 
 *          - application/json
 *      parameters :
 *          -   in : body
 *              name : userAccount
 *              description:    해당 유저 정보 확인
 *              schema :
 *                  type : object
 *                  properties:
 *                      token:
 *                          type : string
 *                  example:
 *                      token : "random string generating server"
 *      responses :
 *          200 :
 *              schema :
 *                  type : object
 *                  properties:
 *                      status :
 *                          type : string  
 *                      msg :
 *                          type : string                        
 */
router.post('/profile/', function(req,res, next){
    // 정상 데이터시 정보 리턴
    let token = req.body.token;
    try{
        var decoded = jwt.verify(token, secretObj.secret);
    }catch (err){
        console.error(err);
        res.status(500).json({status:"fail",msg:"token not valid"});
        return;
    }    
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

/**
 * @swagger
 * /user/api/modify/:
 *  post:
 *      summary : 토큰으로 정보 변경
 *      tags : [User]
 *      produces : 
 *          - application/json
 *      parameters :
 *          -   in : body
 *              name : modifyUser
 *              description :
 *                  토큰으로 확인후 해당 유저에 맞는 정보 변경
 *              schema :
 *                  type : object
 *                  properties:
 *                      token :
 *                          type : string
 *                      modify:
 *                          type : object
 *                          properties:
 *                              pw :
 *                                  type : string
 *                                  description: 변경할 데이터 키 , 값
 *                  example:
 *                      token : random Token
 *                      modify:
 *                          pw : "1234"
 *      responses :
 *          200 :
 *              schema :
 *                  type : object
 *                  properties:
 *                      status :
 *                          type : string  
 */
router.post('/modify/', (req,res,next)=>{
    // 정상 데이터시 정보 변경후 status 값 리턴
    let token = req.body.token;
    let modify = req.body.modify;
    
    try{
        var decoded = jwt.verify(token, secretObj.secret);
    }catch(err){
        console.error(err);
        res.status(500).json({status:"fail",msg:"token not vaild"});
    }
    if(modify.hasOwnProperty('id')){
        delete modify.id;
    }
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

/**
 * @swagger
 * /user/api/secssion/:
 *  post:
 *      summary : 토큰으로 탈퇴
 *      tags : [User]
 *      produces : 
 *          -   application/json
 *      parameters :
 *          -   in : body
 *              name : secssionUser
 *              description :
 *                  토큰으로 확인후 해당 유저 탈퇴
 *              schema :
 *                  type : object
 *                  properties:
 *                      token :
 *                          type : string
 *                  example:
 *                      token : random string
 *      responses :
 *          200 :
 *              schema :
 *                  type : object
 *                  properties:
 *                      status :
 *                          type : string  
 *                      msg : 
 *                          type : string
 */
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