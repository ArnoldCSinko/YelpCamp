// =====================
// INDEX ROUTE
// =====================

var express         = require("express"),
    router          = express.Router({mergeParams: true}),
    Campground      = require("../models/campground"),
    User            = require("../models/user"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local");

router.get("/", function(req, res){    
    res.render("landing");
});

router.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCamps){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/campgrounds", {campgrounds: allCamps});
        }
    });    
});



//Show Registration form
router.get("/register", function(req, res){
    res.render("users/register");
});

//Handle registration logic
router.post("/register", function(req, res){
    
    
        var newUser = new User({username: req.body.username});
        
        User.register(newUser, req.body.password, function(err, user){
            if(err){
                console.log(err);
                req.flash("error", err.message);
                return res.redirect("/register");
            }
            passport.authenticate("local")(req, res, function(){
                req.flash("success", req.body.username +" has been registered");
                res.redirect("/campgrounds");
            });
    
        }); 
   
});

//Show Login Form
router.get("/login", function(req, res){
    res.render("users/login");
});

//Handle Login Logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/register"
        
    }), function(req, res){        
});

//LOGOUT 
router.get("/logout", function(req, res){
    req.logOut();
    req.flash("success", "You have logged out");
    res.redirect("/campgrounds");
});
//==== END OF AUTH ROUTES ============

//===========================
//  EXPORTS
//==========================
module.exports = router;

