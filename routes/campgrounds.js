//  ===========================
//  CAMPGOUND ROUTES
//  ===========================

var Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    express     = require("express"),
    router      = express.Router({mergeParams: true}); 

var middleware  = require("../middleware");


//Get route to show the form for creating a new campground
router.get("/new", middleware.isLoggedIn ,function(req, res){
    res.render("campgrounds/new");
});

//SHOW - Shows more info about a specific campground
router.get("/:id", function(req, res){
    //find campground with given id
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCamp){
        
        if(err || !foundCamp){
            req.flash("error", "Could not find campground");
            return res.redirect("/campgrounds");
        }
        else{
            //render show template for the campground           
            res.render("campgrounds/show", {camp: foundCamp});
        }
    });    

});

//EDIT ROUTE Show edit form
router.get("/:id/edit", middleware.checkCampgroundOwnership ,function(req, res){

    //find campground with given id
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err || !foundCamp){
           flash("error", "Can't find campground");
           return res.redirect("/campgrounds");
        }
        else{
            //render show template for the editing the campground
                                 
            res.render("campgrounds/edit", {camp: foundCamp});
        }
    }); 
});

//UPDATE CAMPGROUND
router.put("/:id", middleware.checkCampgroundOwnership ,function(req, res){
    //Find and update campground from given id
     
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
            if(err || !updatedCamp){
                req.flash("error","Could not edit campground");
                return res.redirect("/campgrounds");
            } else {
                req.flash("success", "This campground has been edited");
                res.redirect("/campgrounds/" + req.params.id);
            }
    
        });
   
    
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership ,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Could not delete campground");
            res.redirect("/campgrounds");
           
        } else {
            req.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
        }
    });
});



//======End of GET Routes for campgrounds=======================

// Post Routes for Campgrounds ================

//Create new Campground if user is logged in
router.post("/", middleware.isLoggedIn,function(req, res){
    
    //Get data from form and add to campgrounds
    var campName = req.body.name;//Get camp name    
    
    var imageUrl = req.body.image;//get image url

    var price = req.body.price; //get price

    var description = req.body.description;//get description
     
    if(campName.length <= 0){
        req.flash("error", "Please enter your username");
        return res.redirect("campgrounds/new");

    } else if(imageUrl.length <= 0){
        req.flash("error", "Please enter an image url");
        return res.redirect("campgrounds/new");

    }else if( description.length <= 0){
        req.flash("error", "Please enter a descripotion");
        return res.redirect("campgrounds/new");

    }else if( price.length <= 0){
        req.flash("error", "Please enter a price");
        return res.redirect("campgrounds/new");      
    }
    else{
        //create camp object
        var camp = {
            name: campName, 
            image: imageUrl,
            price: price, 
            description: description,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        };

         //Add object to database     
        Campground.create(camp, function(err, newCamp){
            if(err || !newCamp){
                req.flash("error", "Campground already exists" );
                return res.redirect("campgrounds/new");             
            }else{
                req.flash( "success", "Created new campground: " + newCamp.name);
                return res.redirect("/campgrounds");
            }
        });
    }      
});

//=================
//  MODULE EXPORTS
//=================
module.exports = router;


