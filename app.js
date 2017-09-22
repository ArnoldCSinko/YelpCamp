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

//Mongoose promise library
mongoose.Promise = global.Promise;

//Database Uri
const databaseUri = process.env.MONGODB_URI || "mongodb://localhost/yelp_camp";
//mongodb://masterblaster:melissa@ds147274.mlab.com:47274/yelpcamp

mongoose.connect(databaseUri, {useMongoClient: true})
    .then(() => console.log("Connected to database"))
    .catch(err => console.log("Error connecting to database: " + err.message));
//Development local mongoose.connet url
//mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});

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
app.listen(app.get("port"), process.env.IP, function(){
    console.log("YelpCamp App has started");
});



