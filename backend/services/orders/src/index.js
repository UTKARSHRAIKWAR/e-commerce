import dotenv from "dotenv"
import express from "express"
import connectDB from "./db/init.js";

dotenv.config();
const app = express();
connectDB();

app.get("/health", (req,res)=>{
    res.json("Order service running");
})

const PORT = process.env.PORT || 3003;

app.listen(PORT, ()=>{
    console.log(`Order services running on Port: ${PORT}`);
})