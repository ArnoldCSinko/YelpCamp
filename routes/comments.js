// ==========================================
//  COMMENT ROUTES JS FILE
//      This defines all routes for comments
//      
// ==========================================

var Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    express     = require("express"),
    router      = express.Router({mergeParams: true});

var middleware  = require("../middleware");
       

//Display form to create new comment for a specific campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            req.flash("error","Campground does not exist");
            return res.redirect("/campgrounds");
        }else{
           res.render("comments/new", {camp: campground});
        }
    });
    
});

// =========================================================
// POST ROUTE to create new comment for specific campground
// /campgrounds/comments METHOD = POST
// =========================================================
router.post("/", middleware.isLoggedIn , function(req, res){    
    // Get campground using id
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Could not find campground");
            res.redirect("back");
        }else{
           
            if(req.body.comment.text.length > 0){
                Comment.create(req.body.comment, function(err, comment){
                    if(err || !comment){
                        req.flash("error","Could not create new comment!!");
                        res.redirect("back");
                    }else{
                        //add username and id to comment
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        //Save comment
                        comment.save();
                        foundCampground.comments.push(comment);
                        foundCampground.save();
                        req.flash("success", "Your comment was added");
                        res.redirect("/campgrounds/" + foundCampground._id);
                    }
                });  
            } else {
                req.flash("error", "Cannot submit empty comment");
                return res.redirect("/campgrounds/" + foundCampground._id +"/comments/new");
            }
                      
        }
    });
});

//============================================
//  EDIT ROUTE - SHOW EDIT COMMENT FORM
//  /campgrounds/:id/comments/:comment_id/edit
//============================================
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req, res){
    //Find Campground by given id    
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err || !foundCamp){
            req.flash("error", "This campground does not exist");
            return res.redirect("back");

        } else {
            //Find comment by given id
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err || !foundComment){
                    
                    req.flash("error", "This comment does not exist");
                    return res.redirect("back");
                } else{
                    //Render form for editing comments and pass campground and comment objects to the form
                    res.render("comments/edit" , {camp: foundCamp, comment: foundComment});
                }
            });
        }
    });
    
    
});

//===============================================
//  UPDATE ROUTE FOR COMMENTS (METHOD = PUT)
//  /campgrounds/:id/comments/:comment_id
//================================================
router.put("/:comment_id", middleware.checkCommentOwnership,function(req, res){
    
        Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
            if(err || !updatedComment){
                
                req.flash("error", "Comment doesn't exist");
                res.redirect("back");
            } else {
                req.flash("success", "Comment updated");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });  
    
    
});

//=========================================================
//  DESTROY ROUTE FOR DELETING A COMMENT (METHOD = DELETE)
// /campgrounds/:id/comments/:comment_id
//=========================================================
router.delete("/:comment_id", middleware.checkCommentOwnership,function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Could not delete comment!!");
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
// ============END OF COMMENT ROUTES ====================

//====================
//  MODULE EXPORTS
//====================
module.exports = router;


