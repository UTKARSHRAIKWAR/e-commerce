import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
         console.log("Mongo DB connected [Shipping services]");
    } catch (error) {
        console.log("Failed to connect DB for [Shipping Services] ", error);
        process.exit(1);
    }
}

export default connectDB;