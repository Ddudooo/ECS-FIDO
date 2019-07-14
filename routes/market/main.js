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

module.exports = router;