import express from "express"
import connectDB from "./DB/db.js";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import userRoutes from "./routes/routes.js"
import logger from "./utils/logger.js";

dotenv.config();
connectDB();  

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.get("/",(req,res)=>{
    res.json("working")
})

app.use("/users", userRoutes);

const PORT = 5001;

app.listen(PORT,()=>{
    logger.info(`Server running on ${PORT}`);
})