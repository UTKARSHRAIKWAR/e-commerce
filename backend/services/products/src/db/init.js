
import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        logger.info("Mongo DB connected [Product services]");
    } catch (error) {
        logger.error("Failed to connect DB for product services: ",error);
        process.exit(1);
    }
}

export default connectDB;