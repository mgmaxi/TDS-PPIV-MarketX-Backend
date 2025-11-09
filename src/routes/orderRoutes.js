import express from 'express';
import {
	crearPedido,
	obtenerMisPedidos,
	obtenerTodosPedidos,
	actualizarEstadoPedido,
} from '../controllers/orderController.js';
import { protect, vendedorOAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Crear pedido (cliente)
router.post('/', protect, crearPedido);

// Ver mis pedidos
router.get('/mis-pedidos', protect, obtenerMisPedidos);

// Ver todos (vendedor/admin)
router.get('/', protect, vendedorOAdmin, obtenerTodosPedidos);

// Actualizar estado (vendedor/admin)
router.put('/:id/estado', protect, vendedorOAdmin, actualizarEstadoPedido);

export default router;
