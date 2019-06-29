var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    id : {
        type: String,
        required : true,
        unique: true,
    },
    pw : {
        type: String,
        required : true,
    },
    email : {
        type: String,
        required : false,
    },
    auth : {
        type: String,        
        default : "None",
    },
    lastJoin : {
        type: Date,
        default: Date.now,
    },
    regDate : {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('user', userSchema);