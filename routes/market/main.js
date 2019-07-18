var express = require('express');
var appRoot = require('app-root-path');
// DB MODELS
var market = require(appRoot + '/models/concert');
var category = market.Category
var router = express.Router();



// url /market/

/* GET home page. */
router.get('', function (req, res, next) {

    res.render('market/main');
});

router.get('/category/create/', function (req, res, next) {
    res.render('market/category_form');
})

router.post('/category/create/', function(req,res,next){
    var newCategory = new  market.Category({
        name: req.body.name,
        priority: req.body.priority
    })

    newCategory.save().then((result)=>{
        console.log(result);
        res.status(200);
        res.redirect('/market/');
    }).catch((err)=>{
        console.error(err);

        res.render('market/category_form',{status:'fail',msg:'already used title'})
    })
})

router.get('/concert/create/', function(req,res, next){
    market.Category.find({})
    .then((categoryes)=>{
        console.log(categoryes);
        res.render('market/concert_form', {catgoryList : categoryes})
    }).catch((err)=>{
        console.error(err);
        res.redirect('/market/');
    })
    
})

router.post('/concert/create/', function(req,res,next){
    console.log(req.body);
    var selectCategory

    var newConcert = new market.Concert({        
        title: req.body.title,
        priority: req.body.priority
    })

    market.Category.find({
        name: req.body.category
    }).then((result)=>{
        if(result.length==1){
            selectCategory = result[0];
            
            console.log(selectCategory)
            
            newConcert.category.push(selectCategory);
            console.log(newConcert);
            
            newConcert.save().then((result)=>{
                console.log(result);
                return result;  
            }).then((concert)=>{
                let defaultArray = ['A', 'B', 'C'];
                for (var i of defaultArray){
                    for (var j =1; j<=3; j++){
                        var newSeat = new market.Seat({
                            mainSeat: i,                            
                            seatNumber: j,
                            priority: 0
                        })
                        newSeat.concert.push(concert);

                        newSeat.save().then((result)=>{
                            console.log(result);
                            
                        }).catch((err)=>{
                            console.error(err);
                            res.redirect('/market/');
                        })
                    }
                }
                
            }).catch((err)=>{
                console.error(err);
                res.redirect('/market/');
            })
        }else{
            res.redirect('/market/concert/create/');
        }
    }).catch((err)=>{
        console.error(err);
        res.redirect('/market/');
    })

    res.status(200);
    res.redirect('/market/');
})
router.get('/concert/',(req,res,next)=>{
    market.Concert.find({})
    .then((concertList)=>{
        // console.log(concertList);
        let count=0;
        concertList.forEach(
            (value, index, list)=>{
                
                // console.log(value);
                market.Category.findOne({
                    _id: value.category
                }).exec((err,data)=>{
                    // console.log(data.name);
                    // console.log(concertList[count]);
                    concertList[count].category[0] = String(data.name);
                    count++;
                    if(count===list.length){
                        console.log('Done!')
                        // console.log(concertList);
                        res.render('market/concert_list', {concertList : concertList})
                    }
                })
                
            }
        )
        console.log("=====================render");
        
    }).catch((err)=>{
        console.error(err);
        res.redirect('/market/');
    })
});

router.post('/concert/', (req,res,next)=>{
    market.Seat.find({
        concert: req.body.concertId
    }).then((Seat)=>{
        //concert seat
        res.render('market/concert_seat',{concertSeat:Seat})
    }).catch((err)=>{
        console.err(err);
        res.redirect('/market/concert/');
    })
})

router.post('/concert/seat/', (req,res, next)=>{
    market.Seat.findOne({
        _id : req.body.seatId
    }).then((seatinfo)=>{
        if(seatinfo!=null){
            seatinfo.status = "Select";
            seatinfo.save().then((result)=>{
                console.log(result);
                res.redirect('/market/');
            })
        }
    }).catch((err)=>{
        console.err(err);
        res.redirect('/market/concert/');
    })
})
module.exports = router;