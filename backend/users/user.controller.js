import asyncHandler from "express-async-handler"
import User from "./user.model";
import { generateAccessToken, generateRefreshToken } from "./generateToken";
const Register = asyncHandler(async(req,res)=>{
    const {name,email,password,phoneNo,role} = req.body;

    if(!name || !email || !password){
        throw new Error("All fields are required");
    }

    email = email.toLowerCase();

    const userExist = await User.findOne({
        $or:[{email},{phoneNo}]
    })

    if(userExist){
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        phoneNo,
        password,
        role,
    })

    if(!user) {
        res.status(500);
        throw new Error("Failed to Create user!")
    }

    const accessToken =  generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201)
        .cookie("accessToken",accessToken, {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge:15*60*1000
        })
        .cookie("refreshToken",refreshToken, {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })
        .json({
            message:"Register Successful",
            user : {
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,}
        })
})



export {Register}