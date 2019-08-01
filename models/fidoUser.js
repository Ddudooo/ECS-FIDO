var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    rpid : {
        type: String,
        required : true,        
    },
    id : {
        type: String,
        required : true,        
    },
    name : {
        type: String,
        required : true,
    },
    displayName : {
        type: String
    },
    aaguid:{
        type : String
    },
    credentialId : {
        type: String
    },
    publicKey : {
        type : String
    },
    algorithm : {
        type : String
    },
    signCounter : {
        type : Number
    },
    attestationType : {
        type : String
    },
    registeredAt : {
        type : Date
    },
    authenticatedAt:{
        type: Date
    },
});

module.exports = mongoose.model('fidoUser', userSchema);