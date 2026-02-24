import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        unique:true,
    },
    items:[
        {
            productId:String,
            quantity:{
                type:Number,
                default:1,
            },
            price:Number
        }
    ]
},
    {timestamps:true}
)

const Cart = mongoose.model("Cart",cartSchema);

export default Cart;