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

module.exports = router;