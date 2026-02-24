import mongoose from "mongoose";

const connectDB = async() => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo DB connected [Payment services]");
    } catch (error) {
        console.log("Failed to connect DB for [Payment Services] ", error);
        process.exit(1);
    }
}

export default connectDB;