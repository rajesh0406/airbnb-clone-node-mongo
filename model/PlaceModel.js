import mongoose, { Schema } from "mongoose";

const placeSchema = new mongoose.Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  amenities: [{ type: String }],
  tags: [{ type: String }],
  photos: [{ type: String }], // URLs to images
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Place", placeSchema);
