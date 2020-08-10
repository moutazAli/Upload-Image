var express = require("express") ;
var mongodb = require("mongodb");
var bodyParser= require('body-parser')
var multer = require('multer');
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/imgDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!..'))
.catch(error => console.log(error.message));

var app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use("/uploads" , express.static("uploads"));


// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null,Date.now() + '-' + file.originalname)
  }
	
})

var upload = multer({ storage: storage })


var imgSchema = mongoose.Schema({
	title : String ,
	pic : String
})

var img = mongoose.model("img",imgSchema);


// routs
app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.post("/upload/photo", upload.single("myImage") ,function(req,res,next){
	var img1 = new img({
		_id : new mongoose.Types.ObjectId,
		title : req.body.title ,
		pic : req.file.path 
	}, function(err,imgfromdb){
		if(err){
			console.log("error happend !!!")
		} else{
			console.log(imgfromdb)
		}
	})
	res.redirect("/");
	
});


app.listen(3100,process.env.IP,function(){
	console.log("server running......")
});