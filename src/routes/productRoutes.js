import express from 'express';
import {
	crearProducto,
	obtenerProductos,
	obtenerProductoPorId,
	actualizarProducto,
	eliminarProducto,
} from '../controllers/productController.js';
import { protegerRuta } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

// Rutas protegidas
router.post('/', protegerRuta, crearProducto);
router.put('/:id', protegerRuta, actualizarProducto);
router.delete('/:id', protegerRuta, eliminarProducto);

export default router;
