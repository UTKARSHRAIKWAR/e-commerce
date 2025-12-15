import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

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
    refreshToken:{
        type:String,
        required:true
    }
})

userSchema.pre("save", async function (next) {
    if(!this.isModified){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model("User",userSchema);
export default User;