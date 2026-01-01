const router = require('express').Router();
import { signup, login } from '../controllers/auth.controller';

router.post('/signup', signup);
router.post('/login', login);

export default router;
