var express = require('express');
var appRoot = require('app-root-path');
// DB MODELS
var market = require(appRoot + '/models/concert');
var category = market.Category

// file control
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, appRoot+'/public/images/upload') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
      cb(null, req.body.title?req.body.title+file.mimetype:file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
  })
  var upload = multer({ storage: storage });

var router = express.Router();

//date control
Date.prototype.yyyymmdd = function(glue) {
    if(glue == null) {
      glue = "/";
    }
    var yyyy = this.getFullYear();
    var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
    var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
    return "".concat(yyyy).concat(glue).concat(mm).concat(glue).concat(dd);
  };

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}



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

router.post('/concert/create/', upload.single('image'), function(req,res,next){
    console.log(req.body);
    var selectCategory

    var newConcert = new market.Concert({        
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        priority: req.body.priority,
        description : req.body.description?req.body.description:''
    })

    market.Category.find({
        name: req.body.category
    }).then((result)=>{
        if(result.length==1){
            selectCategory = result[0];
            if(req.file){
                console.log("Upload file!"+req.file.originalname);
                console.log("Upload file mimetype : " +req.file.mimetype);
                console.log("Upload file path : "+req.file.path);
                newConcert.thumbnail = "/images/upload/"+req.file.originalname;
            }
            console.log(selectCategory);
            
            newConcert.category = selectCategory;
            console.log(newConcert);
            
            newConcert.save().then((result)=>{
                console.log(result);
                return result;  
            }).then((concert)=>{
                var concert_startDate = new Date(concert.startDate);
                const concert_endDate = new Date(concert.endDate);

                while(concert_startDate <= concert_endDate){
                    let defaultArray = ['A', 'B', 'C'];
                    for (var i of defaultArray){
                        for (var j =1; j<=3; j++){
                            var newSeat = new market.Seat({
                                mainSeat: i,                            
                                seatNumber: j,
                                date: concert_startDate.yyyymmdd(),
                                priority: 0
                            })
                            newSeat.concert =concert;

                            newSeat.save().then((result)=>{
                                console.log(result);
                                
                            }).catch((err)=>{
                                console.error(err);
                                res.redirect('/market/');
                            })
                        }
                    }
                    concert_startDate = concert_startDate.addDays(1);
                }
            }).catch((err)=>{
                console.log("FAIL TO CREATE CONCERT!!!!!");
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
        res.render('market/concert_seat',{concertSeat:Seat});
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
                setTimeout(()=>{
                    if(result.status=="Select"){
                        result.status = "None";
                        result.save().then((releaseSeat)=>{
                            console.log("Release seat");
                        }).catch((err)=>{
                            console.error(err);
                        });
                    }
                }, 1000*60);
                res.redirect('/market/');
            })
        }
    }).catch((err)=>{
        console.err(err);
        res.redirect('/market/concert/');
    })
})
module.exports = router;
