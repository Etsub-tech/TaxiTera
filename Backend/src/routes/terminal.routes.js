import express from "express";
import Terminal from "../models/Terminal.model.js";
import { searchTerminals } from "../controllers/terminal.controller.js";
import { optionalProtect } from "../middleware/auth.middleware.js"; // Import this

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
// router.post("/search", searchTerminals);

// Search nearby terminals (Apply optionalProtect here)
router.post("/search", optionalProtect, searchTerminals);

export default router;


