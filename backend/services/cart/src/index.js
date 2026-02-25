import dotenv from "dotenv"
import express from "express"
import connectDB from "./db/init.js";
import cartRoutes from "./routes/cart.routes.js"


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
    console.log(`Cart services running on Port: ${PORT}`);
})