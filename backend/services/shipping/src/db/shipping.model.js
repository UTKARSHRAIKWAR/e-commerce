import mongoose from "mongoose";

const shippingSchema =new mongoose.Schema(
    {
        orderId:{
            type:String,
            required:true,
            unique:true,
        },
        userId:{
            type:String,
            required:true,
        },
        address:{
            fullName:String,
            phone:String,
            street:String,
            city:String,
            state:String,
            postalCode:String,
            country:String
        },
        trackingNumber:{
            type:String,
            unique:true,
        },
        carrier:{
            type:String,
            default:"E-KART"
        },
        status:{
            type:String,
            enum:["processing","shipped","in_transit","delivered","returned"],
            default:"processing"
        },
    },
    {timestamps:true}
)

const Shipping = mongoose.model("Shipping", shippingSchema)

export default Shipping;