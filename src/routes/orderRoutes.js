import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
	res.send('Rutas de pedidos funcionando correctamente ');
});

export default router;
