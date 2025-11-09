import express from 'express';
import {
	registrarUsuario,
	loginUsuario,
	perfilUsuario,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/profile', protect, perfilUsuario);

export default router;
