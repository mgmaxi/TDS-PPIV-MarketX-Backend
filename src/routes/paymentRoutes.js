import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
	res.send('Rutas de pagos funcionando correctamente');
});

export default router;
