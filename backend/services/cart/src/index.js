import dotenv from "dotenv"
import express from "express"
import connectDB from "./db/init.js";
import cartRoutes from "./routes/cart.routes.js"
import './events/orderConfirmed.event.js'
import logger from "./utils/logger.js";


dotenv.config();
const app = express();
connectDB();

app.use(express.json())

app.get("/health", (req,res)=>{
    res.json("Cart service running");
})

app.use("/",cartRoutes);


const PORT = process.env.PORT || 3004;

app.listen(PORT, ()=>{
    logger.info(`Cart services running on Port: ${PORT}`);
})