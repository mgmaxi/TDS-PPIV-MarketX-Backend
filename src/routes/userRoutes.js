import express from 'express';
import {
	registrarUsuario,
	loginUsuario,
	perfilUsuario,
} from '../controllers/userController.js';
import { protegerRuta } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/profile', protegerRuta, perfilUsuario);

export default router;
