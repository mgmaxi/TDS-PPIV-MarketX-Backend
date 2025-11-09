import User from '../models/User.js';
import generarToken from '../utils/generateToken.js';
import { enviarEmail } from '../utils/emailService.js';
import { registroTemplate } from '../utils/templates/registroTemplate.js';

// Registrar nuevo usuario
export const registrarUsuario = async (req, res) => {
	try {
		const { nombre, email, password, rol } = req.body;

		// Verificar si ya existe el usuario
		const existeUsuario = await User.findOne({ email });
		if (existeUsuario)
			return res.status(400).json({ mensaje: 'El usuario ya existe' });

		// Crear el nuevo usuario
		const user = await User.create({ nombre, email, password, rol });

		// Enviar el correo de bienvenida
		await enviarEmail(
			user.email,
			'🎉 Bienvenido a MarketX',
			registroTemplate(user.nombre, user.email)
		);

		// Responder con los datos del nuevo usuario
		res.status(201).json({
			_id: user._id,
			nombre: user.nombre,
			email: user.email,
			rol: user.rol,
			token: generarToken(user._id),
		});
	} catch (error) {
		console.error('❌ Error al registrar usuario:', error);
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
		console.error('❌ Error en login:', error);
		res.status(500).json({ mensaje: error.message });
	}
};

// Perfil de usuario
export const perfilUsuario = async (req, res) => {
	try {
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
	} catch (error) {
		console.error('❌ Error al obtener perfil:', error);
		res.status(500).json({ mensaje: error.message });
	}
};
