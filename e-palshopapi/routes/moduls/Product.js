const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, require: true, unique: true },
        desc: { type: String , require: true},
        img: {type : String, unique: true },
        category: { type: Array },
        color: { type: String },
        size: { type: String },
        price: {type:Number , require: true}
    },
    {timestamps:true}
);
module.exports = mongoose.model('Product', ProductSchema);