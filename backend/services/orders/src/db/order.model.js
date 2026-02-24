import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId:String,
        items:[
            {
                productId:String,
                quantity:Number,
                price:Number,
            }
        ],
        totalAmount:Number,
        status:{
            type:String,
            enum:["pending","paid","shipped","delivered","cancelled"],
            default:"pending",
        },
        paymentStatus:{
            type:String,
            enum:["pending","success","failed"],
            default:"pending"
        },
        paymentId:String,
    },
    {timestamps:true}
)

const Orders = mongoose.model("order",orderSchema);

export default Orders;