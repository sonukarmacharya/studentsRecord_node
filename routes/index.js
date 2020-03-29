var express = require('express');
var multer = require('multer')
var path = require('path')
var stsModel = require('../modules/students')
var router = express.Router();
var student = stsModel.find({})

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
router.get('/', function(req, res, next) {
  student.exec(function(err,data){
    if(err) throw err
    res.render('index', { title: 'Students records',msg:''});
  
  }) 
});
router.post('/', upload,function(req, res, next) {
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

router.get('/detail', function(req, res, next) {
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
