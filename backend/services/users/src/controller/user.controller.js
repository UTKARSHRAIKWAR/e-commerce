import asyncHandler from "express-async-handler"
import User from "../DB/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../Auth/generateToken.js";
import jwt from "jsonwebtoken";
const Register = asyncHandler(async(req,res)=>{

   let {name, phoneNo, email,password,role} = req.body;
    
    if(!name || !phoneNo || !password){
        throw new Error("All fields are required");
    }

    const userExist = await User.findOne({
        phoneNo
    })
    
    if(userExist){
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        phoneNo,
        email,
        password,
        role,
    })
    

    if(!user) {
        res.status(500);
        throw new Error("Failed to Create user!")
    }

    const accessToken =  generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

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
            phoneNo:user.phoneNo,
            email:user.email,
            role:user.role,}
        })
})

const login = asyncHandler(async(req,res)=>{
    let {email , phoneNo , password} = req.body;

    
    if((!email && !phoneNo) || !password){
        res.status(400);
        throw new Error("All fields are required");
    }

    if (email){ email = email.toLowerCase();}


    const user = await User.findOne({
        // $or:[{email},{phoneNo}]
        phoneNo
    })


    if(!user){
        res.status(401);
        throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();


    if(await user.matchPassword(password)){
        res.status(200)
        .cookie("accessToken", accessToken, {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })
        .json({
            _id:user._id,
            name:user.name,
            phoneNo:user.phoneNo,
            email:user.email,
            role:user.role,
        })
    } else {
        res.status(401);
        throw new Error("Invalid credentials")
    }
})

const logout = asyncHandler(async (req,res) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.sendStatus(204); //token not found -> already logout
    }

    const user = await User.findOne({refreshToken});
    if(user){
        user.refreshToken = null;
        await user.save();
    }

    res
    .clearCookie("refreshToken",{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict"
    })
    .clearCookie("accessToken",{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict"
    })
    .status(200)
    .json({message:"Logged out successfully"})
})

const refreshToken = asyncHandler(async(req,res) => {
    const token = req.cookies?.refreshToken;
    if(!token) {
        return res.status(401).json({message:"Token not found."})
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_RefreshSecret);
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token." });
    }
    
    const user = await User.findById(decoded._id).select("-password");

    if(!user || user.refreshToken !== token){
        return res.status(403).json({message:"Invalid or expired refresh token."})
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200)
    .cookie("accessToken",newAccessToken, {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge:15*60*1000
        })
    .cookie("refreshToken",newRefreshToken, {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })
    .json({message:"Token refreshed successfully."})
})

const getUserById = asyncHandler(async(req,res)=>{
    const {id} = req.params;

    const user = await User.findById(id).select("email name");

    if(!user){
        res.status(403).json({message:"User not found"})
    }

    res.status(200).json(user);
})

export {Register, login, logout ,refreshToken ,getUserById}