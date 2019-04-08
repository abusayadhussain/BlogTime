var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

//App config
mongoose.connect("mongodb://localhost/blogtime", {useNewUrlParser: true});
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//Mongoose/Model config
var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);



//Restful Routes
app.get("/", function(req, res){
    res.redirect("/blogs");
});
//Index route
app.get("/blogs", function(req, res){
    Blog.find({},function(err, blogs){
        if(err){
            console.log("Something went wrong!!");
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});

//New Route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//Create Route

app.post("/blogs", function(req, res){
    //  create new blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            // redirect to the index page
            res.redirect("/blogs");
        }
    });
    
});

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.render("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
});

//Edit route

app.get("/blogs/:id/edit", function(req, res) {
   Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.render("/blogs");
        }else{
            res.render("edit", {blog: foundBlog});
        }
    });
    
});

//Update route

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});

//Delete route

app.delete("/blogs/:id", function(req, res){
   //Delete blog
   
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } else{
           //redirect somewhere
           res.redirect("/blogs");
       }
   })
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog Server Is Running...");
});