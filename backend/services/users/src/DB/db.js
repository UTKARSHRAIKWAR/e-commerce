import mongoose from "mongoose";
import logger from "../utils/logger.js";
const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        logger.info("Mongo connected successfully");
    } catch (error) {
        logger.error("Failed to connect DB : ",error);
        process.exit(1)
    }
}

export default connectDB;