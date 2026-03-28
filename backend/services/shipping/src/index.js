import "dotenv/config"
import express from "express"
import connectDB from "./db/init.js"
import shippingRoutes from "./routes/shipping.routes.js"
import './events/orderConfirmed.event.js'
import logger from "./utils/logger.js"


connectDB();
const app = express();
app.use(express.json());


app.use("/",shippingRoutes);

app.get("/health",(req,res)=>{
    res.json("Shipping service running"); 
})

const PORT = process.env.PORT || 3006;


app.listen(PORT,()=>{
    logger.info(`Shipping services running on Port: ${PORT}`);
})