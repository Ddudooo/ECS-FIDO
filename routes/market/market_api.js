var express = require('express');
var appRoot = require('app-root-path');
// DB MODELS
var market = require(appRoot + '/models/concert');
var User = require(appRoot + '/models/user');
var jwt = require('jsonwebtoken');
var secretObj = require(appRoot + '/config/jwt');
var router = express.Router();



// url /market/api/

router.get('', function (req, res, next) {
    res.json({
        status: "success",
        msg: "check for endpoint"
    });
});

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
            if (!req.body.seatId) {
                let query = {
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
                market.Seat.findOne(query).exec((err, seat) => {
                    if (err || !seat) {
                        res.json({
                            status: "fail",
                            msg: "please check information, nothing found"
                        });
                    } else {
                        seat.status = "Select";
                        console.log("========================================================");
                        console.log(seat);
                        console.log("========================================================");
                        seat.save()
                            .then((result) => {
                                req.session.seatTimeOut = setTimeout((result) => {
                                    if (result.status == "Select") {
                                        result.status = "None";
                                        result.save().then((releaseSeat) => {
                                            console.log(releaseSeat);
                                            console.log("release select seat");
                                        }).catch((err) => {
                                            console.error(err);
                                        });
                                    }
                                }, 1000 * 60 * 5);
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
                    }
                });
            }
        } else {
            res.status(403).json({
                status: "fail",
                msg: "you're token not verified, please check information"
            });
        }

    }
});
module.exports = router;