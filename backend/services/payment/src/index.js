import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./db/init.js";
import paymentRoutes from "./routes/payment.route.js"
import logger from "./utils/logger.js";


const app = express();
connectDB();

app.use(express.json());

app.get("/health", (req,res)=>{
    res.json("Payment service running");
})

app.use("/",paymentRoutes)

const PORT = process.env.PORT || 3005;

app.listen(PORT, ()=>{
    logger.info(`Payment services running on Port: ${PORT}`);
})