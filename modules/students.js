var mongoose = require('mongoose')
mongoose.connect('mmongodb://localhost:27017/students',{useNewUrlParser:true})

var conn = mongoose.connection

var studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    class: Number,
    phnumber: Number,
    imagename: String,
    
})
var studentModel = mongoose.model('Students',studentSchema)

module.exports = studentModel