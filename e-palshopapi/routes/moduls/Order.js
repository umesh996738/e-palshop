const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, require: true, unique: true },
        products: [
            {
                productId: {
                    type:String,
                    
                },
                quantity: {
                    type: Number,
                    defualt:1,
                },
            },
        ],
        amount: { type: Number, required: true, unique: true },
        address: { type: Object },
        status: {type:String,defualt:"panding"},
        
    },
    {timestamps:true}
);
module.exports = mongoose.model('Order', OrderSchema);