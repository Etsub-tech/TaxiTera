require('dotenv').config();
const mongoose = require('mongoose');
const Terminal = require('../src/models/Terminal.model');

const terminals = [
  {
    name: "Megenagna Terminal",
    area: "Yeka",
    routes: ["Bole", "Piazza"],
    price: 35,
    location: {
      type: "Point",
      coordinates: [38.7993, 9.0243]
    }
  },
  {
    name: "Bole Terminal",
    area: "Bole",
    routes: ["Megenagna"],
    price: 40,
    location: {
      type: "Point",
      coordinates: [38.7816, 9.0054]
    }
  }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Terminal.insertMany(terminals);
    console.log("Terminal data seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
