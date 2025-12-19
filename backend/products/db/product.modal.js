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
        required:true,
    },
    categoryId:{},
    stockQuantity:{
        type:Number,
        required:true,
    },
    images:{
        type:Array,
        required:true,
    },
    averageRatings:{},
    ratingCount:{},
    isActive:{},
    sellerId:{}
},{ timestamps: true })

const Products = mongoose.model("Products",productSchema);

export default Products