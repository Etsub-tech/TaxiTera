import express from 'express';
import {saveHistory, getHistory} from '../controllers/history.controller.js';
import {protect} from '../middleware/auth.middleware.js';

const router=express.Router();

router.post('/',protect,saveHistory);
router.get('/',protect,getHistory);

export default router;
