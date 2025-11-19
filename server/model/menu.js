let mongoose = require('mongoose')

// create a model class
let menuModel = mongoose.Schema({
    ItemType:String,
    ItemName: String,
    Description: String,
    Calories:Number,
    Price:Number,
    DietaryRes: String
},
{
    collection:"menu"
}
);

module.exports = mongoose.model('menu', menuModel);