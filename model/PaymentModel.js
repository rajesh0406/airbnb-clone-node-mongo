import mongoose, { Schema } from "mongoose";

const paymentSchema = new mongoose.Schema({
  booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
  amount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "paypal", "bank_transfer"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  transactionId: { type: String }, // Payment gateway transaction ID
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", paymentSchema);
