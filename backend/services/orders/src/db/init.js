import mongoose from "mongoose";

const connectDB = async() => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo DB connected [Order services]");
    } catch (error) {
        console.log("Failed to connect DB for [Order Services] ", error);
        process.exit(1);
    }
}

export default connectDB;