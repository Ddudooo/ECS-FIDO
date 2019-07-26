/**
 * @swagger
 * tags:
 *  name: market
 *  description : 티켓 구매
 */
var express = require('express');
var appRoot = require('app-root-path');
// DB MODELS
var market = require(appRoot + '/models/concert');
var User = require(appRoot + '/models/user');
var jwt = require('jsonwebtoken');
var secretObj = require(appRoot + '/config/jwt');
var router = express.Router();



// url /market/api/
/**
 * @swagger
 * /market/api/: 
 *      get :
 *          summary : market api 테스트
 *          tags : [market]
 *      responses :
 *          200 : 
 *              desciption : 성공
 */
router.get('', function (req, res, next) {
    res.json({
        status: "success",
        msg: "check for endpoint"
    });
});

/**
 * @swagger
 * /market/api/concert/: 
 *      get :
 *          summary : concert 정보 
 *          tags : [market]
 *          parameters:
 *              - name : category
 *                require : false
 *                in : query
 *                type : string
 *                description : 카테고리명으로 콘서트 검색
 *          
 *          responses :
 *               '200' : 
 *                  description : 성공
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type:string
 *                          concertList :
 *                              type: array
 *                              items :
 *                                  type : object
 *                                  properties :
 *                                      status : 
 *                                          type : string
 *                                      title :
 *                                          type : string
 *                      example :
 *                          status: 성공 여부
 *                          concertList :
 *                              items:
 *                                  status : 콘서트 활성 상태
 *                                  title : 콘서트 명
 *      post :
 *          summary : 콘서트 좌석 정보
 *          tags : [market]
 *          produces :
 *              - application/json
 *          parameters:
 *              - in : body
 *                description : 콘서트 검색 </br>
 *                              이름으로 검색시 동일 이름 여러 개 나올 수 있음 
 *                schema :
 *                  type : object
 *                  properties:
 *                      title:
 *                          type:string
 *                      concertId :
 *                          type:string
 *                  example :
 *                      title : 콘서트 명 (없을시 ID값 필요)
 *                      concertId : 콘서트 ID (없을시 콘서트 명 필요)
 *          responses :
 *              '200' :
 *                  description : 성공
 *                  schema:
 *                      type : object
 *                      properties :
 *                          status : 
 *                              type : string
 *                              description : 반환 상태
 *                          concertSeat :
 *                              type : array
 *                              items : 
 *                                  type : object
 *                                  properties:
 *                                      status:
 *                                          type : string
 *                                      mainSeat:
 *                                          type : string
 *                                      seatNumber:
 *                                          type : string
 *                              
 */
router.get('/concert/', (req, res, next) => {
    console.log("GET '/market/api/concert/' ");
    console.log(req.query);
    if (req.query.category) {
        market.Category.findOne({
            name: req.query.category
        }).exec((err, data) => {
            if (err || !data) {
                res.json({
                    status: "fail",
                    msg: "check category name"
                });
            } else {
                market.Concert.find({
                        category: data
                    }).then((concertList) => {
                        console.log(concertList);
                        let count = 0;
                        concertList.forEach(
                            (value, index, list) => {
                                market.Category.findOne({
                                    _id: value.category
                                }).exec((err, data) => {
                                    concertList[count].category[0] = String(data.name);
                                    count++;
                                    if (count == list.length) {
                                        console.log('Done!');

                                        res.json({
                                            status: "success",
                                            concertList: concertList
                                        });
                                    }
                                });
                            }
                        );
                    })
                    .catch((err) => {
                        console.error(err);
                        res.json({
                            status: "fail",
                            msg: "check information"
                        });
                    });
            }
        });

    } else {
        market.Concert.find({})
            .then((concertList) => {
                let count = 0;
                concertList.forEach(
                    (value, index, list) => {
                        market.Category.findOne({
                            _id: value.category
                        }).exec((err, data) => {
                            concertList[count].category[0] = String(data.name);
                            count++;
                            if (count == list.length) {
                                console.log('Done!');

                                res.json({
                                    status: "success",
                                    concertList: concertList
                                });
                            }
                        });
                    }
                );
            })
            .catch((err) => {
                console.error(err);
                res.json({
                    status: "fail",
                    msg: "check information"
                });
            });
    }
});

router.post('/concert/', (req, res, next) => {
    console.log("POST '/market/api/concert/'");
    console.log(req.body);
    if (req.body.title) {
        let query = {
            title: req.body.title
        };
        if (req.body.concertId) {
            query._id = req.body.concertId;
        }
        market.Concert.find(query).then((concert) => {
            console.log(concert);
            if (concert.length > 1) {
                res.json({
                    status: "fail",
                    msg: "please return concert id",
                    concertList: concert
                });
                return;
            } else if (concert.length == 1) {
                market.Seat.find({
                    status: "None"
                }).then((Seat) => {
                    res.json({
                        status: "success",
                        concertSeat: Seat
                    });
                    return;
                }).catch((err) => {
                    console.error(err);
                    res.json({
                        status: "fail",
                        msg: "please check information"
                    });
                    return;
                });
            } else {
                res.json({
                    status: "fail",
                    msg: "please check information, nothing found"
                });
                return;
            }
        }).catch((err) => {
            console.error(err);
            res.json({
                status: "fail",
                msg: "please check information"
            });
            return;
        });
    } else {
        let query = {
            _id: req.body.concertId
        };
        market.Concert.findOne(query).exec((err, concert) => {
            if (concert) {
                market.Seat.find({
                    concert: concert
                }).then((Seat) => {
                    //concert seat
                    res.json({
                        status: "success",
                        concertSeat: Seat
                    });
                    return;
                }).catch((err) => {
                    console.err(err);
                    res.redirect('/market/concert/');
                });
            } else if (err || !concert) {
                if (err) {
                    console.error(err);
                }
                res.json({
                    status: "fail",
                    msg: "please check information"
                });
                return;
            }
        });
    }
});
/**
 * @swagger
 * /market/api/seat/:
 *      post :
 *          summary : 콘서트 좌석 선택
 *          tags : [market]
 *          produces : 
 *              - application/json
 *          parameters:
 *              - in : body
 *                description : 콘서트 좌석 정보</br>
 *                              Login으로 생성된 JWT 토큰 필요 </br>
 *                              seatId 혹은 mainSeat, (middleSeat), seatNumber 필요</br>
 *                              선택 좌석은 5분후에도 'Select'상태일시 초기 상태로 돌아감
 *                schema : 
 *                  type : object
 *                  properties :
 *                      token :
 *                          type : string
 *                          require : true
 *                      seatId :
 *                          type : string
 *                      mainSeat :
 *                          type : string
 *                      seatNumber :
 *                          type : number
 *                  example : 
 *                      token : login jwt token (반드시 필요)
 *                      seatId : seat _id value (없어도 되나 별도의 좌석 정보 필요)
 *                      mainSeat : A, B , C... (없을 경우 좌석 ID 필요)
 *                      seatNumber : 123
 *          responses:
 *              '200' :
 *                  description : 성공
 *                  schema:
 *                      type : object
 *                      properties : 
 *                          status : 
 *                              type : string
 *                          selectSeat :
 *                              type : string 
 * 
 *                          
 */
router.post('/seat/', (req, res, next) => {
    console.log("POST '/market/api/seat/'");
    console.log(req.body);
    if (!req.body.token) {
        res.status(403).json({
            status: "fail",
            msg: "please login first"
        });
    } else {
        let decode;
        try{
            decode = jwt.verify(req.body.token, secretObj.secret)
        }catch(err){
            console.error(err);
            res.json({status:"fail", msg:"please login first"});
            return;
        }
        if (decode) {
            let query;
            if (!req.body.seatId) {
                query = {
                    concert: req.body.concertId
                };
                if (req.body.mainSeat && req.body.seatNumber) {
                    query.mainSeat = req.body.mainSeat;
                    query.seatNumber = req.body.seatNumber;
                } else {
                    res.json({
                        status: "fail",
                        msg: "please check information"
                    });
                    return;
                }
            }else{
                query ={
                    _id : req.body.seatId
                };
            }
            market.Seat.findOne(query).exec((err, seat) => {
                if (err || !seat) {
                    res.json({
                        status: "fail",
                        msg: "please check information, nothing found"
                    });
                } else {
                    User.findOne({
                        id : decode.id, 
                    }).exec((err, user)=>{
                        if(err|!user){
                            res.status(500).json({status:"fail",msg:"please check login information"});
                            return;
                        }
                        seat.status = "Select";    
                        seat.user = user;
                        console.log("========================================================");
                        console.log(seat);
                        console.log("========================================================");
                        seat.save()
                            .then((result) => {
                                setTimeout(() => {
                                    if (result.status == "Select") {
                                        result.status = "None";
                                        delete result.user;
                                        result.save().then((releaseSeat) => {
                                            console.log(releaseSeat);
                                            console.log("release select seat");
                                        }).catch((err) => {
                                            console.error(err);
                                        });
                                    }
                                }, 1000 * 60 *5 );
                                console.log("Seat Release setTimeOut...");
                                // delete result.concert;
                                // console.log(typeof(result));
                                // console.log(result);
                                // console.log("=============================================================");
                                //let selectSeat = JSON.stringify(seat);
                                // Converting circular 에러로 인한 입력                                
                            }).catch((err) => {
                                console.error(err);
                                res.json({
                                    status: "fail",
                                    msg: "ticket select error, sorry"
                                });
                                return;
                            });
                        res.json({
                            status:"success",
                            selectSeat : seat
                        });
                        return;
                    });
                    
                }
            });
            
        } else {
            res.status(403).json({
                status: "fail",
                msg: "you're token not verified, please check information"
            });
        }

    }
});
/**
 * @swagger
 * /market/api/seat/payment/:
 *      post :
 *          summary : 좌석 결정 (결제)
 *          tags : [market]
 *          produces : 
 *              - application/json
 *          parameters :
 *              - in : body
 *                description : 선택 좌석을 결정 상태(결제 상태)로 변경 </br>
 *                              결제 모듈 추가 여부에 따라 수정될 가능성이 있음
 *                schema :
 *                  type : object
 *                  properties :
 *                      token :
 *                          type : string
 *                          require : true
 *                      seatId :
 *                          type : string
 *                          require : true
 *                  example :
 *                      token : 로그인 과정으로 생성된 JWT 토큰
 *                      seatId : 좌석 선택 과정으로 얻은 좌석 ID
 *          responses :
 *              '200' :
 *                  descripttion : 성공
 *                  schema :
 *                      type : object 
 *                      properties : 
 *                          status : 
 *                              type : string
 *                          msg : 
 *                              type : string
 *                          seat :
 *                              type : object
 *                              properties :
 *                                  _id : 
 *                                      type : string
 *                                  status :
 *                                      type : string
 *                      example :
 *                          status : success
 *                          msg : Payment successed
 *                          seat :
 *                              _id : 좌석 ID
 *                              status : payed
 */
router.post('/seat/payment/', (req,res,next)=>{
    let query={};
    if(req.body.token){
        let decode;
        try{
            decode = jwt.verify(req.body.token, secretObj.secret);
        }catch(err){
            console.error(err);
            res.json({status:"fail", msg:"token not valid, please retry login"});
            return;
        }
        if(decode){
            User.findOne({
                id : decode.id
            }).exec((err, user)=>{
                if(err|!user){
                    res.status(500).json({status:"fail", msg:"please check information, your account disabled"});
                    return;
                }
                if(req.body.seatId){
                    query._id = req.body.seatId;
                    query.user = user;
                    query.status = "Select";
                }else{
                    res.status(500).json({status:"fail", msg:"please check information, required seat id"});
                    return;
                }
                market.Seat.findOne(query).exec((err,seat)=>{
                    if(err|!seat){
                        res.status(500).json({status:"fail", msg:"please check information, seat not found"});
                        return;
                    }
                    if(String(seat.user) === String(user._id) && seat.status == "Select"){                        
                        seat.status = "payed";
                        try{
                            console.log("this version is test demo");
                            /*
                            Some payment logic
                            */
                        }catch(payError){
                            console.error(payError);
                            res.status(500).json({status:"fail", msg:"Some thing wrong, please check information"});
                            return;
                        }
                        seat.save().then((result)=>{
                            res.status(200).json({status:"success",msg:"Payment successed, enjoy", seat: result});
                            return;
                        }).catch((saveError)=>{
                            /*
                            payment revork logic
                            */                            
                            console.error(saveError);
                            res.status(500).json({status:"fail", msg:"Some thing wrong, please check information"});
                            return;
                        });
                    }else{
                        res.status(500).json({status:"fail", msg:"please check information, this seat not yours"});
                        return;
                    }
                });
            });
        }else{
            res.json({status:"fail", msg:"token not valid, please retry login"});
            return;
        }
    }else{
        res.status(403).json({status:"fail", msg:"seat payment fail, login first"});
        return;
    }
});
module.exports = router;