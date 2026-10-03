import express from 'express';
import {saveHistory, getHistory, getPopularRoutes} from '../controllers/history.controller.js';
import {protect} from '../middleware/auth.middleware.js';

const router=express.Router();

router.post("/", protect, saveHistory);
router.get("/", protect, getHistory);
router.get("/popular", protect, getPopularRoutes);

export default router;
