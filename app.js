const bodyParser = require("body-parser");
const express = require("express");
const expressSanitizer = require("express-sanitizer");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
app = express();


//  APP CONFIG
mongoose.connect("mongodb://localhost:27017/restful_blog_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));

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

// INDEX ROUTES
app.get("/", function (req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("ERROR!");
        } else {
            res.render("index", { blogs: blogs });
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", function (req, res) {
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function (req, res) {
    // create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            // then redirect to index
            res.redirect("/blogs");
        }
    })
})

//  SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", { blog: foundBlog });
        }
    })
});

// EDIT ROUTE

app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//  DELETE ROUTE
app.delete("/blogs/:id", function (req, res) {
    // destroy route
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
    //  Redirect Somewhere
    // res.send("DESTROY ROUTE");
})

app.listen(port, function () {
    console.log("Server up!");
})