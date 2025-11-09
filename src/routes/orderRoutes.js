import express from 'express';
import {
	crearPedido,
	obtenerMisPedidos,
	obtenerTodosPedidos,
} from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, crearPedido); // Crear pedido
router.get('/mis-pedidos', protect, obtenerMisPedidos); // Ver los propios
router.get('/', protect, obtenerTodosPedidos); // Ver todos

export default router;
