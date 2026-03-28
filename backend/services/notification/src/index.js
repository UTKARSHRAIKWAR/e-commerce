import "dotenv/config"
import express from "express"
import connectDB from "./db/init.js";
import notificationRoutes from "./routes/notification.route.js"
import "./events/orderConfirmed.event.js";
import logger from "./utils/logger.js";

const app = express();
connectDB();

app.use(express.json());

app.use("/",notificationRoutes);

app.get("/health", (req,res)=>{
    res.json("notification service working");
})


const PORT = process.env.PORT || 3007;

app.listen(PORT,()=>{
    logger.info(`notification services running on Port: ${PORT}`);
})