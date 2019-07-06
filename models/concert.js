var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name : {
        type: String,
        required : true,
        unique: true,
    },
    priority : {
        type: String,
        required : false,
    },
    status : {
        type: String,        
        default : "None",
    },
    changeDate : {
        type: Date,
        default: Date.now,
    },
    regDate : {
        type: Date,
        default: Date.now,
    },
})

var concertSchema = new Schema({
    title: {
        type: String,
        require : true,        
    },
    category : {
        type: String,
        required : true,
        unique: true,
    },
    priority : {
        type: String,
        required : false,
    },
    status : {
        type: String,        
        default : "None",
    },
    changeDate : {
        type: Date,
        default: Date.now,
    },
    regDate : {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('category', categorySchema);
module.exports = mongoose.model('concert', concertSchema);