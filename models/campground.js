var mongoose = require("mongoose");

//MONGO DB SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    
});
//MODEL EXPORTED
module.exports = mongoose.model("Campground", campgroundSchema);