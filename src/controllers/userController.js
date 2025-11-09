import User from '../models/User.js';
import generarToken from '../utils/generateToken.js';

// Registrar nuevo usuario
export const registrarUsuario = async (req, res) => {
	try {
		const { nombre, email, password, rol } = req.body;

		const existeUsuario = await User.findOne({ email });
		if (existeUsuario)
			return res.status(400).json({ mensaje: 'El usuario ya existe' });

		const user = await User.create({ nombre, email, password, rol });
		res.status(201).json({
			_id: user._id,
			nombre: user.nombre,
			email: user.email,
			rol: user.rol,
			token: generarToken(user._id),
		});
	} catch (error) {
		res.status(500).json({ mensaje: error.message });
	}
};

// Login de usuario
export const loginUsuario = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (user && (await user.compararPassword(password))) {
			res.json({
				_id: user._id,
				nombre: user.nombre,
				email: user.email,
				rol: user.rol,
				token: generarToken(user._id),
			});
		} else {
			res.status(401).json({ mensaje: 'Credenciales inválidas' });
		}
	} catch (error) {
		res.status(500).json({ mensaje: error.message });
	}
};

// Perfil de usuario
export const perfilUsuario = async (req, res) => {
	const user = await User.findById(req.user._id);
	if (user) {
		res.json({
			_id: user._id,
			nombre: user.nombre,
			email: user.email,
			rol: user.rol,
		});
	} else {
		res.status(404).json({ mensaje: 'Usuario no encontrado' });
	}
};
