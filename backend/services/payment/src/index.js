import dotenv from "dotenv"
import express from "express"
import connectDB from "./db/init";


dotenv.config();
const app = express();
connectDB();

app.get("/health", (req,res)=>{
    res.json("Payment service running");
})

const PORT = process.env.PORT || 3003;

app.listen(PORT, ()=>{
    console.log(`Payment services running on Port: ${PORT}`);
})