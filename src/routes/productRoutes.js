import express from 'express';
import {
	crearProducto,
	obtenerProductos,
	obtenerProductoPorId,
	actualizarProducto,
	eliminarProducto,
} from '../controllers/productController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

// Rutas protegidas
router.post('/', protect, crearProducto);
router.put('/:id', protect, actualizarProducto);
router.delete('/:id', protect, eliminarProducto);

export default router;
