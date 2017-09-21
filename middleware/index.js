var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");   
    
   
//ALL MIDDLEWARE IS HERE
var middlewareObj = {};

//==============================================
//  CHECK IF A USER CREATED THIS CAMPGROUND POST
//==============================================
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //Is User logged in?
    if(req.isAuthenticated()){
        //Yes. Find campground associated with this post
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("error", "That campground does not exist");
                res.redirect("/");//Campground not found redirect back
            }else {

            
            //Verify that the author id associated w/ this campground matches current users id.                
                if(foundCampground.author.id.equals(req.user._id)){
                   next();
                } else {
                    //If not correct user then redirect back and display message
                    req.flash("error", "You did not post this campground");
                    res.redirect("back");
                }           
            }
        });
    } else{
        //User is not logged in redirect to login route
        req.flash("error", "Please login first");
        res.redirect("/login"); 
    }

};

//===============================
//  CHECK IF USER OWNS A COMMENT
//===============================
middlewareObj.checkCommentOwnership = function(req, res, next){
     //User Logged in?
     if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
             if(err || !foundComment){
                req.flash("error", "Comment does not exist");
                return res.redirect("/campgrounds/"+ req.params.id);
             } else {
                 //Does the comment author's id match current user id?
                 if(foundComment.author.id.equals(req.user._id)){
                    next();//Yes do next operation
                 } else {
                    req.flash("error", "You do not own this comment");
                    res.redirect("back");//no redirect back
                 }
             }
        });
     }else { //User not logged in then redirect to login route
        req.flash("error", "Please login first");
        res.redirect("/login"); 
     }
};

//================================
//  CHECK IF USER IS LOGGED IN
//================================
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first");
    res.redirect("/login");//No redirect user to login form
};


module.exports = middlewareObj;