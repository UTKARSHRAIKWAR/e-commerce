import express from "express"
import connectDB from "./db.js";
import dotenv from "dotenv"

dotenv.config();
connectDB();

const app = express();

app.get("/",(req,res)=>{
    res.json("working")
})

const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
    
})