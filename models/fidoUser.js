var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fidoUserSchema = new Schema({
    rpid : {
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
    id : {
        type: String,
        required : true
    },
    sessionId : {
        type : String
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
    state : {
        type: String
    }
});

module.exports = mongoose.model('fidoUser', fidoUserSchema);
