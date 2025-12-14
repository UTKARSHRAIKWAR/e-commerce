import mongoose, { Schema } from "mongoose";

const userSchema = Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        unique:true,
    },
    role:{
        type:String,
        required:true,
        enum:["user,seller,admin"],
        default:"user",
    },
    phoneNo:{
        type:Number,
        required:true,
    },
    address:{
        type:String,
    },
    isVerified :{
        type:Boolean,
    },
})

const User = mongoose.model("User",userSchema);
export default User;