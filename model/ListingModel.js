import mongoose, { Schema } from "mongoose";

const listingSchema = new mongoose.Schema({
  property: { type: Schema.Types.ObjectId, ref: "Place", required: true },
  availableDates: [{ startDate: Date, endDate: Date }],
  maxPeople: { type: Number, required: true },
  pricePerNight: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Listing", listingSchema);
