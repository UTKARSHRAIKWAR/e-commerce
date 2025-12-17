import asyncHandler from "express-async-handler"
import User from "../DB/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../Auth/generateToken.js";
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
        $or:[{email},{phoneNo}]
    })


    if(!user){
        res.status(401);
        throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();


    if(await user.matchPassword(password)){
        res.status(200)
        .cookie("accessToken", accessToken, {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge:15*60*1000
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
        return res.sendStatus(204); // already logout
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
export {Register, login, logout}