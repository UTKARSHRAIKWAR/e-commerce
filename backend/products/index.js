import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/init.js";

dotenv.config()
connectDB();

const app = express();


app.get("/", (req,res)=>{
    res.json("product working");
})

const PORT = process.env.PORT || 3002

app.listen(PORT,()=>{
    console.log(`Product services running on ${PORT}`)
})