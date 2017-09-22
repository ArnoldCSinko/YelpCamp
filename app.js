//  ==================================
//  APP.JS controller for application
//  ==================================

// REQUIRE 
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    flash           = require("connect-flash"),
    User            = require("./models/user"),
    seedDB          = require("./seeds"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override");





// APP CONFIG
app.set("port", (process.env.PORT || 3000));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});

app.use(methodOverride("_method"));
//SEED THE DATABASE
// seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "This is the greatest secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new  LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//Pass user object to res.locals so it can be accessed by all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");

    next();
});

// ROUTES
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(indexRoutes);

//SERVER LISTEN
app.listen(app.get("port"), function(){
    console.log("YelpCamp App has started");
});



