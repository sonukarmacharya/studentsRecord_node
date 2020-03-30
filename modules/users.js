var mongoose = require('mongoose')
mongoose.connect('mmongodb://localhost:27017/student',{useNewUrlParser:true, useCreateIndex:true})

var conn = mongoose.connection

var usersSchema = new mongoose.Schema({
    username: {type:String,
        required: true,
        index:{
            unique: true,
        }},

    email: {type:String,
        required:true,
        index:{
            unique:true,
        }},

    password:{type:String,
        required:true,
    },
    date:{type:Date,
        default: Date.now

    }
    
})
var usersModel = mongoose.model('users',usersSchema)

module.exports = usersModel