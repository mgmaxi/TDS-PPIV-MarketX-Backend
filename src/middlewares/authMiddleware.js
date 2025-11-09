import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protegerRuta = async (req, res, next) => {
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
			res.status(401).json({ mensaje: 'Token inválido o expirado' });
		}
	}

	if (!token)
		return res.status(401).json({ mensaje: 'No autorizado, sin token' });
};

export const admin = (req, res, next) => {
	if (req.user && req.user.rol === 'admin') {
		next();
	} else {
		res
			.status(403)
			.json({ mensaje: 'Acceso denegado: se requiere rol administrador' });
	}
};

export const vendedorOAdmin = (req, res, next) => {
	if (req.user && (req.user.rol === 'vendedor' || req.user.rol === 'admin')) {
		next();
	} else {
		res
			.status(403)
			.json({ mensaje: 'Acceso denegado: se requiere rol vendedor o admin' });
	}
};
