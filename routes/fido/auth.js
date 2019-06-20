var express = require('express');
var base64url = require('base64url');
var regenerate = require('regenerate');
var router = express.Router();


router.post('/challenge', function (req, res, next) {
    data = {
        "serverResponse": {
            "internalError": "SUCCESS",
            "internalErrorCode": 0
        },
        "challenge": "e5LU-rdjmKr4jDb51_Mt-tTp90JZjKyIjWs1TBIdTNJq0u2l4LOlb52zIrop7Gupzs1Gvzb0a_lW6iU-y1S4eQ",
        "timeout": 50000,
        "rpId": "localhost",
        "allowCredentials": [{
            "type": "public-key",
            "id": "ANYT_i8ijCUb8Z2nTf4u-vCf0qPnDhaYnO-p-WRWZH-S9WLZtpIQ7FjXrXzwgyJftSM_t9LBr4zQAxnVDhpB3_y-994Hrz30PBrpYcFNR8nJaKn-BmseolfhtPnjVS-2d5pglg"
        }],
        "userVerification": "preferred",
        "sessionId": "44151e02-58b9-494b-9df7-a49ba7ec5b14"
    };
    res.send(data);
});

module.exports = router;