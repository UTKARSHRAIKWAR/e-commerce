import dotenv from "dotenv"
import express from "express"
import connectDB from "./db/init.js";
import orderRoutes from "./routes/order.routes.js"
import logger from "./utils/logger.js";

dotenv.config();
const app = express();
connectDB();

app.use(express.json());

app.get("/health", (req,res)=>{
    res.json("Order service running");
})

app.use("/",orderRoutes);

const PORT = process.env.PORT || 3004;

app.listen(PORT, ()=>{
    logger.info(`Order services running on Port: ${PORT}`);
})