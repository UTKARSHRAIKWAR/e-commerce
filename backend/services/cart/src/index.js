import dotenv from "dotenv"
import express from "express"
import connectDB from "./db/init.js";


dotenv.config();
const app = express();
connectDB();

app.get("/health", (req,res)=>{
    res.json("Cart service running");
})

const PORT = process.env.PORT || 3004;

app.listen(PORT, ()=>{
    console.log(`Cart services running on Port: ${PORT}`);
})