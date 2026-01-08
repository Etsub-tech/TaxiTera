import "dotenv/config";
import mongoose from "mongoose";
import Terminal from "../src/models/Terminal.model.js";  // 👈 import the model itself

const terminals = [
  {
    name: "Megenagna Terminal",
    area: "Yeka",
    routes: ["Bole", "Piazza"],
    price: 35,
    location: {
      type: "Point",
      coordinates: [38.7993, 9.0243],
    },
  },
  {
    name: "Bole Terminal",
    area: "Bole",
    routes: ["Megenagna"],
    price: 40,
    location: {
      type: "Point",
      coordinates: [38.7816, 9.0054],
    },
  },
  {
    name: "Mexico Terminal",
    area: "Mexico",
    routes: ["Bole", "Piazza", "Saris"],
    price: 30,
    location: {
      type: "Point",
      coordinates: [38.7403, 9.0609], // 👈 matches your query coords
    },
  },

];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Terminal.insertMany(terminals);   // 👈 call insertMany on the model
    console.log("Terminal data seeded successfully");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err.message);
    process.exit(1);
  }
})();
