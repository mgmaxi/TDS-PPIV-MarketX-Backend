import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware para proteger rutas (solo usuarios autenticados)
export const protect = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1];

			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decoded.id).select('-password');

			next();
		} catch (error) {
			return res.status(401).json({ mensaje: 'Token inválido o expirado' });
		}
	}

	if (!token) {
		return res.status(401).json({ mensaje: 'No se proporcionó token' });
	}
};

// Middleware para permitir solo vendedores o administradores
export const vendedorOAdmin = (req, res, next) => {
	if (req.user && (req.user.rol === 'vendedor' || req.user.rol === 'admin')) {
		next();
	} else {
		res
			.status(403)
			.json({ mensaje: 'Acceso denegado. Solo vendedores o administradores.' });
	}
};
