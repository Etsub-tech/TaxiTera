import mongoose from "mongoose";

const terminalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    area: { type: String, required: true },
    routes: { type: [String], required: true },
    price: { type: Number, default: null },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true } // stored as [longitude, latitude]
    }
  },
  { timestamps: true }
);

terminalSchema.index({ location: "2dsphere" });

// Helper: detect and swap coordinates if they appear as [lat, lon]
function ensureGeoJSONOrder(coords) {
  if (!Array.isArray(coords) || coords.length < 2) return coords;
  const [a, b] = coords;
  // Heuristic: latitude values (in this dataset) are around 8-10, longitude around 38-40
  if (typeof a === 'number' && typeof b === 'number' && a > 20 && b < 20) {
    // already [lon, lat]
    return coords;
  }
  if (typeof a === 'number' && typeof b === 'number' && a < 20 && b > 20) {
    // appears to be [lat, lon] => swap to [lon, lat]
    return [b, a];
  }
  return coords;
}

// Ensure inserted docs have coordinates in GeoJSON order (lon, lat)
terminalSchema.pre('save', function (next) {
  if (this.location && Array.isArray(this.location.coordinates)) {
    this.location.coordinates = ensureGeoJSONOrder(this.location.coordinates);
  }
  next();
});

terminalSchema.pre('insertMany', function (next, docs) {
  if (Array.isArray(docs)) {
    for (const d of docs) {
      if (d.location && Array.isArray(d.location.coordinates)) {
        d.location.coordinates = ensureGeoJSONOrder(d.location.coordinates);
      }
    }
  }
  next();
});

// When converting documents to JSON for the API, present coordinates in frontend order [lat, lon]
terminalSchema.set('toJSON', {
  transform(doc, ret) {
    if (ret.location && Array.isArray(ret.location.coordinates) && ret.location.coordinates.length >= 2) {
      const [lon, lat] = ret.location.coordinates;
      ret.location.coordinates = [lat, lon];
    }
    return ret;
  }
});

export default mongoose.model("Terminal", terminalSchema);