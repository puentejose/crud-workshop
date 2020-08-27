const bodyParser = require("body-parser");
var express = require("express");
const mongoose = require("mongoose");
app = express();
var port = process.env.PORT || 3000;


//  APP CONFIG
mongoose.connect("mongodb://localhost:27017/restful_blog_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

//  MONGOOOSE MODEL
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Post",
//     image: "https://cdnpt01.viewbug.com/media/mediafiles/2016/07/23/67433304_medium.jpg",
//     body: "HELLO WORLD"
// });
// title
// image
// body
// created


// RESTFUL ROUTES

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

app.listen(port, function () {
    console.log("Server up!");
})