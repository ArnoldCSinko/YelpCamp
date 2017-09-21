var mongoose = require("mongoose");

var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Clouds Rest",
        image: "https://farm7.staticflickr.com/6210/6090170567_6df55f8d83.jpg",
        price: "$12",
        description: "Camp on a mountain in the clouds"
    },
    {
        name: "Crystal Lake",
        image: "https://farm7.staticflickr.com/6210/6090170567_6df55f8d83.jpg",
        price: "$5",
        description: "Spooky campground in the woods near camp Crystal Lake. May be haunted by a masked serial killer"
    },
    {
        name: "Sasquatch Bay",
        image: "https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg",
        price: "$3",
        description: "Camp next to the legendary Sasquatch. Leave the beef jerkey at home"
    },
    {
        name: "Area 51",
        image: "https://farm3.staticflickr.com/2919/14554501150_8538af1b56.jpg",
        price: "$100",
        description: "Camp at the secret military base with the grays and reptillians"
    }
];

function seedDB(){
    // Remove Campgrounds
    Campground.remove({}, function(err){
    //     if(err){
    //         console.log(err);
    //     } else{
    //         console.log("Removed Campgrounds");
    //          // Add Campgrounds
    //         data.forEach(function(seed){
    //             Campground.create(seed, function(err, campground){
    //                 if(err){
    //                     console.log("Error creating seed campground");
    //                 } else{
    //                     console.log("Added campground");
    //                     Comment.create({
    //                         text: "This is a great place but no Internet connection",
    //                         author: "Master"
    //                     }, function(err, comment){
    //                         if(err){
    //                             console.log("Couldnt add comment");
    //                         }else {
    //                             campground.comments.push(comment);                                
    //                             campground.save();
                                
    //                         }
    //                     });
    //                 }
    //             });
    //         });
    //     }
    });
}

module.exports = seedDB;

