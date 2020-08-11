var express = require("express") ;
var mongodb = require("mongodb");
var bodyParser= require('body-parser')
var multer = require('multer');
var mongoose = require('mongoose');
// ******
var fs = require('fs'); 
var path = require('path'); 

// var MongoClient = require('mongodb').MongoClient;
// var assert = require('assert');

// const url = 'mongodb+srv://$moutazAli:$qwaszx123**@$[hostlist]/$imgDB?retryWrites=true';

mongoose.connect('mongodb://localhost:27017/imgDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!..'))
.catch(error => console.log(error.message));

var app = express();

// app.set("view engine", "ejs"); 
app.use(bodyParser.urlencoded({extended: true}))
app.use("/uploads" , express.static("uploads"));

app.use(bodyParser.json()) //****


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

// ***
var imgSchema = mongoose.Schema({
	title : String ,
	pic : { 
        data: Buffer, 
        contentType: String 
    } 
})

var imgModel = mongoose.model("img",imgSchema);


// routs
app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
  imgModel.find({}, (err, items) => { 
      if (err) { 
         console.log(err); 
	   } 
      else { 
     // returning a list of the images
		var returnedImgs = new Array ;
		items.forEach(function(image){
			returnedImgs.push(image);
		})
		console.log(returnedImgs);
   } 
  }); 
});

app.post("/upload/photo", upload.single("myImage") ,function(req,res,next){

	var obj = { 
        title: req.body.title, 
        pic: { 
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
            contentType: 'image/png'
        } 
    } 
    imgModel.create(obj, (err, item) => { 
        if (err) { 
            console.log(err); 
        } 
        else { 
            res.redirect('/'); 
        } 
    }); 
	
});


app.listen(3100,process.env.IP,function(){
	console.log("server running......")
});