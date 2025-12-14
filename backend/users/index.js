import express from "express"
import connectDB from "./db.js";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const app = express();
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.json("working")
})

const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
    
})