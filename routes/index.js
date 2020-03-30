var express = require('express');
var multer = require('multer')
var path = require('path')
var jwt = require('jsonwebtoken')
var stsModel = require('../modules/students')
var userModel = require('../modules/users')
var bcrypt = require('bcryptjs')

if(typeof localStorage == "undefined" || localStorage == null){
  const LocalStorage = require('node-localstorage').LocalStorage
  localStorage = new LocalStorage("./scratch")
}

var router = express.Router();
var student = stsModel.find({})
var users = userModel.find({})

router.use(express.static(__dirname+"./public/"))

var Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
  }
})

var upload = multer({
  storage: Storage
}).single('file')
/* GET home page. */
function checkEmail(req,res,next){
  var email = req.body.email
  var checkexitemail = userModel.findOne({email:email})
  checkexitemail.exec((err,data)=>{
    if(err) throw err
    if(data){
      return res.render('signup', { title: 'Students records System',msg:'Email already exist'});
  
    }
    next()
  })
}
function checkUsername(req,res,next){
  var uname = req.body.uname
  var checkexituname = userModel.findOne({username:uname})
  checkexituname.exec((err,data)=>{
    if(err) throw err
    if(data){
      return res.render('signup', { title: 'Students records System',msg:'Username already exist'});
  
    }
    next()
  })
}
function checkloginUser(req,res,next){
  var userToken = localStorage.getItem('userToken')
  try{
    var decode = jwt.verify(userToken,'loginToken')
  }
  catch(err){
    res.redirect('/')
  }
  next()
}
router.get('/', function(req, res, next) {
 
    res.render('login', { title: 'Students records System',msg:''});
  
  }) 
  router.post('/', function(req, res, next) {
   
    var Email = req.body.email
    var password = req.body.pass
    
    var checkemail = userModel.findOne({email:Email})
    checkemail.exec((err,data)=>{
      if(err) throw err
      var getUserId = data._id
      var getPass = data.password
      if(bcrypt.compareSync(password,getPass)){
        var token = jwt.sign({useerId:getUserId},'loginToken')
        localStorage.setItem('userToken',token)
        // localStorage.setItem('logiuser',uname)
        res.redirect('/stsform')
     }
      else{
        res.render('login',{title:'Student recods system',msg:'Doesnot log in'})
   
      }      
  }) })
  router.get('/signup', function(req, res, next) {
 
    res.render('signup', { title: 'Students records System',msg:''});
  
  })
  router.post('/signup',checkUsername,checkEmail, function(req, res, next) {
    var username = req.body.uname
    var email = req.body.email
    var password = req.body.pass
    var cpass = req.body.cpass
    if(password!=cpass){
      res.render('signup', { title: 'Students records System',msg:'Password doesnot match'});
  
    }
    else{

   password = bcrypt.hashSync(password,10 )
    var userDetail = new userModel({
     username: username,
      email:email,
      password:password
    })
    userDetail.save(function(err,data){
      if(err) throw err
      res.render('login', { title: 'Students records System',msg:'Registered successfully'});
    })
  }
   
  })
  router.get('/logout', function(req, res, next) {
    localStorage.removeItem('userToken')
    res.redirect('/')
  });

router.get('/stsform',checkloginUser, function(req, res, next) {
  student.exec(function(err,data){
    if(err) throw err
    res.render('index', { title: 'Students records',msg:''});
  
  }) 
});
router.post('/stsform', upload,function(req, res, next) {
  var imageFile = req.file.filename

  var stsDetail = new stsModel({
    name:req.body.name,
    email:req.body.email,
    address: req.body.add,
    class: req.body.class,
    phnumber: req.body.ph,
    imagename: imageFile,
  })

  stsDetail.save(function(err,req1){
    if(err) throw err
    else{
   
      student.exec(function(err,data){
        if(err) throw err
        res.render('index', {  title: 'Students records',msg:'Record inserted successfully'});
      })
    }
    
  })
 
});

router.get('/detail', checkloginUser,function(req, res, next) {
  student.exec(function(err,data){
    if(err) throw err
    res.render('detail', { title: 'Students records',records:data});
  
  }) 
});

router.get('/delete/:id', function(req, res, next) {
  var id = req.params.id
  var del = stsModel.findByIdAndDelete(id)
  del.exec(function(err,data){
    if(err) throw err
    res.redirect('/detail/')
  }) 
});

router.get('/edit/:id', function(req, res, next) {
  var id = req.params.id
  var ed = stsModel.findByIdAndUpdate(id)
  ed.exec(function(err,data){
    if(err) throw err
    res.render('edit', { title: ' Edit students records',records:data});
  
  }) 
});
router.post('/update/',upload, function(req, res, next) {
  var imageFile = req.file.filename
  var update = stsModel.findByIdAndUpdate(req.body.id,{
    name:req.body.name,
    email:req.body.email,
    address: req.body.add,
    class: req.body.class,
    phnumber: req.body.ph,
    imagename : imageFile
  })

  update.exec(function(err,req1){
    if(err) throw err
    else{   
      res.redirect('/detail/') 
    }
    
  })
 
});

router.post('/search', function(req, res, next) {
  var fltrname = req.body.name
  var fltrclass = req.body.class
  var searchSts = stsModel.find({
    $and:[{name:fltrname},{class:fltrclass}]
  })
  searchSts.exec(function(err,data){
    if(err) throw err
    res.render('detail', { title: 'Students records',records:data});
  
  }) 
});
module.exports = router;
