import mongoose from "mongoose";

const connectDB = async() => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo DB connected [Cart services]");
    } catch (error) {
        console.log("Failed to connect DB for [Cart Services] ", error);
        process.exit(1);
    }
}

export default connectDB;