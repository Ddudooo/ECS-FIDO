var mongoose = require('mongoose');
var User = require('./user');
var Schema = mongoose.Schema;

var categorySchema = new Schema({   // 카테고리 스키마
    name : {                        // 콘서트 종류, 추후 시험이나 티켓에 대한 종류로도 추가할 수 있을듯함
        type: String,
        required : true,           
        unique: true,               // 종류는 중복값을 방지
    },
    priority : {                    //우선 순위
        type: Number,
        default: 0,        
    },
    status : {                      // 활성 상태
        type: String,        
        default : "None",
    },
    changeDate : {                  // 변동 시간
        type: Date,
        default: Date.now,
    },
    regDate : {                     // 생성 시간
        type: Date,
        default: Date.now,
    },
})
var Category = mongoose.model('category', categorySchema, 'concert_category');

var concertSchema = new Schema({    //콘서트 스키마
    title: {                        // 콘서트 제목
        type: String,
        require : true,        
    },
    category : [
        {
            type: Schema.ObjectId,
            ref: 'Category',
            require: true,
        },
    ],
    priority : {                    // 우선순위
        type: Number,
        required : false,
    },
    status : {                      // 활성 상태
        type: String,        
        default : "None",
    },
    changeDate : {                  // 변동 시간
        type: Date,
        default: Date.now,
    },
    regDate : {                     // 생성 시간
        type: Date,
        default: Date.now,
    },
})
var Concert =mongoose.model('concert', concertSchema, 'concert');

var seatSchema = new Schema({       // 자리 스키마
    concert: [
        {
            type: Schema.Types.ObjectId,
            ref: Concert,
            require: true
        }
    ],
    user: {
            type: Schema.Types.ObjectId,
            ref: User,
            require: false
    },
    mainSeat:{                      // 주 분류 A열 B열 ...
        type: String,
        require : true
    },
    middleSeat:{                    // 중 분류 추가 분류가 필요할 경우 사용
        type: String,
        require : false
    },
    seatNumber : {                  // 소 분류 좌열 번호
        type : Number,
        require : true
    },
    priority : {                    // 우선순위
        type: String,
        required : false,
    },
    status : {                      // 활성 상태
        type: String,        
        default : "None",
    },
    changeDate : {                  // 변동일
        type: Date,
        default: Date.now,
    },
    regDate : {                     // 생성일
        type: Date,
        default: Date.now,
    },
})
var Seat = mongoose.model('seat', seatSchema, 'concert_seat')
// module.exports = mongoose.model('category', categorySchema, 'concert_category');
// module.exports = mongoose.model('concert', concertSchema, 'concert');
module.exports = {
    Category: Category,
    Concert: Concert,
    Seat: Seat
};