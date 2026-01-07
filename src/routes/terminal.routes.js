import express from "express";
import { searchTerminals } from "../controllers/terminal.controller.js";
import Terminal from "../models/Terminal.model.js";

const router = express.Router();

// Get all terminals (for debugging)
router.get("/", async (req, res) => {
  try {
    const terminals = await Terminal.find();
    res.json(terminals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search nearby terminals (guest or logged-in)
router.post("/search", searchTerminals);

export default router;