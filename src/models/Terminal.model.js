import mongoose from "mongoose";

const terminalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    area: { type: String, required: true },
    routes: { type: [String], required: true },
    price: { type: Number, default: null },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true } // [longitude, latitude]
    }
  },
  { timestamps: true }
);

terminalSchema.index({ location: "2dsphere" });

export default mongoose.model("Terminal", terminalSchema);