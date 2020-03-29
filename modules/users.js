var mongoose = require('mongoose')
mongoose.connect('mmongodb://localhost:27017/student',{useNewUrlParser:true})

var conn = mongoose.connection

var usersSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    password: String,
    
})
var usersModel = mongoose.model('Students',Schema)

module.exports = usersModel