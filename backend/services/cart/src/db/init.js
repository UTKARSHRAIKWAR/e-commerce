import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async() => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        logger.info("Mongo DB connected [Cart services]");
    } catch (error) {
        logger.error("Failed to connect DB for [Cart Services] ", error);
        process.exit(1);
    }
}

export default connectDB;