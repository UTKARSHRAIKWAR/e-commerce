import dotenv from "dotenv"
import express from "express"
import connectDB from "./db/init.js";
import orderRoutes from "./routes/order.routes.js"

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
    console.log(`Order services running on Port: ${PORT}`);
})