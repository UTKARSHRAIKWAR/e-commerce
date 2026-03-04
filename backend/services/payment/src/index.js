import dotenv from "dotenv"
import express from "express"
import connectDB from "./db/init.js";
import paymentRoutes from "./routes/payment.route.js"


dotenv.config();
const app = express();
connectDB();

app.use(express.json());

app.get("/health", (req,res)=>{
    res.json("Payment service running");
})

app.use("/",paymentRoutes)

const PORT = process.env.PORT || 3005;

app.listen(PORT, ()=>{
    console.log(`Payment services running on Port: ${PORT}`);
})