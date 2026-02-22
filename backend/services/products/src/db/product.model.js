import { Timestamp } from "bson";
import mongoose, { Schema } from "mongoose"
const productSchema = Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    discount:{
        type:Number,
        required:false,
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"Category"
    },
    stockQuantity:{
        type:Number,
        required:false,
    },
    images:{
        type:[String],
        required:true,
    },
    averageRatings:{
        type:Number,
        default:0,
    },
    ratingCount:{
        type:Number,
        default:0,
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    sellerId:{
        type:String,
        required:true,
    }
},{ timestamps: true })

const Products = mongoose.model("Products",productSchema);

export default Products