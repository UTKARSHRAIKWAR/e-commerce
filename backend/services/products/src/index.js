import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/init.js";
import productRoutes from "./routes/product.route.js"
import categoryRoutes from "./routes/category.routes.js"
import "./events/orderConfirmed.listener.js";
import logger from "./utils/logger.js";

dotenv.config()
connectDB();

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


app.get("/health", (req,res)=>{
    res.json("product working");
})

app.use("/categories", categoryRoutes);
app.use("/", productRoutes);

const PORT = process.env.PORT || 3002

app.listen(PORT,()=>{
    logger.info(`Product services running on ${PORT}`)
})