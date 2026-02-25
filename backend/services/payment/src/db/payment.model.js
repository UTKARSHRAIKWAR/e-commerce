import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: String,
  userId: String,
  amount: Number,
  status: String,
  provider: String
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);