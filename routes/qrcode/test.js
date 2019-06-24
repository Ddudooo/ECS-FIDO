var express = require('express');

const QRCode = require('qrcode');

var router = express.Router();

// url /qrcode/test

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('qrcode/qrcode', {
        title: 'QrCode Test Generator Page'
    });
});

router.get('/generate/:qrcode', function (req, res, next) {
    let inputStr = req.params.qrcode;

    QRCode.toDataURL(inputStr, function (err, url) {


        let data = url.replace(/.*,/,'')
        let img = new Buffer(data,'base64')
        res.writeHead(200,{
            'Content-Type' : 'image/png',
            'Content-Length' : img.length
        })
        res.end(img)

    })
});

module.exports = router;