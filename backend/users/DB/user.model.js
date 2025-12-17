import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        // required:true,
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
        enum:["user","seller","admin"],
        default:"user",
    },
    phoneNo:{
        type:Number,
        unique:true,
        sparse:true
    },
    address:{
        type:String,
    },
    isVerified :{
        type:Boolean,
    },
    refreshToken:{
        type:String,
        default:null
    }
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    if(!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre("save", async function () {
    if(!this.isModified("password")){
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})



const User = mongoose.model("User",userSchema);
export default User;