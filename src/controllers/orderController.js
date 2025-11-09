import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { enviarEmail } from '../utils/emailService.js';
import { pedidoCreadoTemplate } from '../utils/templates/pedidoCreadoTemplate.js';
import { pedidoActualizadoTemplate } from '../utils/templates/pedidoActualizadoTemplate.js';

// Crear pedido
export const crearPedido = async (req, res) => {
	try {
		const { productos, metodoPago } = req.body;

		if (!productos || productos.length === 0) {
			return res.status(400).json({ mensaje: 'No hay productos en el pedido' });
		}

		// Calcular total y validar stock
		let total = 0;
		for (const item of productos) {
			const producto = await Product.findById(item.producto);
			if (!producto) {
				return res
					.status(404)
					.json({ mensaje: `Producto no encontrado: ${item.producto}` });
			}
			if (producto.stock < item.cantidad) {
				return res
					.status(400)
					.json({ mensaje: `Stock insuficiente para ${producto.nombre}` });
			}

			// Restar stock
			producto.stock -= item.cantidad;
			await producto.save();

			total += producto.precio * item.cantidad;
			item.precioUnitario = producto.precio;
		}

		// Crear pedido
		const pedido = new Order({
			usuario: req.user._id,
			productos,
			total,
			metodoPago,
		});

		const creado = await pedido.save();

		// Enviar email de confirmación al comprador
		try {
			const usuario = await User.findById(req.user._id);
			await enviarEmail(
				usuario.email,
				'🛍️ Confirmación de tu pedido en MarketX',
				pedidoCreadoTemplate(usuario.nombre, creado._id, creado.total)
			);
			console.log('📨 Email de confirmación enviado a', usuario.email);
		} catch (err) {
			console.error('❌ Error al enviar correo de confirmación:', err.message);
		}

		res.status(201).json(creado);
	} catch (error) {
		console.error('❌ Error al crear pedido:', error.message);
		res
			.status(500)
			.json({ mensaje: 'Error al crear pedido', error: error.message });
	}
};

// Ver pedidos del usuario autenticado
export const obtenerMisPedidos = async (req, res) => {
	try {
		const pedidos = await Order.find({ usuario: req.user._id })
			.populate('productos.producto', 'nombre precio')
			.sort({ createdAt: -1 });

		res.json(pedidos);
	} catch (error) {
		console.error('❌ Error al obtener pedidos:', error.message);
		res.status(500).json({ mensaje: 'Error al obtener pedidos' });
	}
};

// Ver todos los pedidos (solo admin o vendedor)
export const obtenerTodosPedidos = async (req, res) => {
	try {
		const pedidos = await Order.find()
			.populate('usuario', 'nombre email')
			.populate('productos.producto', 'nombre precio categoria');

		res.json(pedidos);
	} catch (error) {
		console.error('❌ Error al obtener todos los pedidos:', error.message);
		res.status(500).json({ mensaje: 'Error al obtener todos los pedidos' });
	}
};

// Actualizar estado del pedido
export const actualizarEstadoPedido = async (req, res) => {
	try {
		const { id } = req.params;
		const { estado } = req.body;

		const pedido = await Order.findById(id);
		if (!pedido) {
			return res.status(404).json({ mensaje: 'Pedido no encontrado' });
		}

		const estadosValidos = [
			'pendiente',
			'pagado',
			'enviado',
			'entregado',
			'cancelado',
		];
		if (!estadosValidos.includes(estado)) {
			return res.status(400).json({ mensaje: 'Estado no válido' });
		}

		pedido.estado = estado;
		const actualizado = await pedido.save();

		// Enviar email al usuario con la actualización
		try {
			const usuario = await User.findById(pedido.usuario);
			await enviarEmail(
				usuario.email,
				`📦 Actualización de tu pedido (${pedido._id})`,
				pedidoActualizadoTemplate(usuario.nombre, estado, pedido._id)
			);
			console.log('📨 Email de actualización enviado a', usuario.email);
		} catch (err) {
			console.error('❌ Error al enviar correo de actualización:', err.message);
		}

		res.json({ mensaje: 'Estado del pedido actualizado', pedido: actualizado });
	} catch (error) {
		console.error('❌ Error al actualizar estado del pedido:', error.message);
		res.status(500).json({
			mensaje: 'Error al actualizar estado del pedido',
			error: error.message,
		});
	}
};
