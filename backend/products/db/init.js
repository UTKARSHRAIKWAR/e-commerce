import { log } from "console";
import mongoose from "mongoose";

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo DB connected [Product services]");
    } catch (error) {
        console.log("Failed to connect DB for product servies: ",error);
        process.exit(1);
    }
}

export default connectDB;