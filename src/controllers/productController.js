import Product from '../models/Product.js';

// Crear producto (solo vendedor/admin)
export const crearProducto = async (req, res) => {
	try {
		const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;

		const producto = new Product({
			nombre,
			descripcion,
			precio,
			stock,
			categoria,
			imagen,
			vendedor: req.user._id,
		});

		const productoGuardado = await producto.save();
		res.status(201).json(productoGuardado);
	} catch (error) {
		res.status(500).json({ mensaje: error.message });
	}
};

export const obtenerProductos = async (req, res) => {
	try {
		// Paginación
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		// Filtros
		const filtro = {};

		if (req.query.nombre) {
			filtro.nombre = { $regex: req.query.nombre, $options: 'i' }; // búsqueda parcial
		}

		if (req.query.categoria) {
			filtro.categoria = req.query.categoria;
		}

		if (req.query.min || req.query.max) {
			filtro.precio = {};
			if (req.query.min) filtro.precio.$gte = Number(req.query.min);
			if (req.query.max) filtro.precio.$lte = Number(req.query.max);
		}

		// Ordenamiento validado
		const camposPermitidos = [
			'precio',
			'nombre',
			'categoria',
			'stock',
			'createdAt',
		];
		let ordenCampo = 'createdAt';
		let direccion = -1;

		if (req.query.sort) {
			const campo = req.query.sort.replace('-', '');
			const dir = req.query.sort.startsWith('-') ? -1 : 1;

			if (camposPermitidos.includes(campo)) {
				ordenCampo = campo;
				direccion = dir;
			}
		}

		//  Consulta principal
		const total = await Product.countDocuments(filtro);
		const productos = await Product.find(filtro)
			.populate('usuario', 'nombre email')
			.skip(skip)
			.limit(limit)
			.sort({ [ordenCampo]: direccion }); //  validado dinámico

		res.json({
			page,
			total,
			totalPaginas: Math.ceil(total / limit),
			resultados: productos.length,
			orden: { campo: ordenCampo, direccion },
			productos,
		});
	} catch (error) {
		res
			.status(500)
			.json({ mensaje: 'Error al obtener productos', error: error.message });
	}
};

// Obtener un producto por ID
export const obtenerProductoPorId = async (req, res) => {
	try {
		const producto = await Product.findById(req.params.id);
		if (!producto)
			return res.status(404).json({ mensaje: 'Producto no encontrado' });
		res.json(producto);
	} catch (error) {
		res.status(500).json({ mensaje: error.message });
	}
};

// Actualizar producto
export const actualizarProducto = async (req, res) => {
	try {
		const producto = await Product.findById(req.params.id);
		if (!producto)
			return res.status(404).json({ mensaje: 'Producto no encontrado' });

		if (
			producto.vendedor.toString() !== req.user._id.toString() &&
			req.user.rol !== 'admin'
		) {
			return res.status(401).json({ mensaje: 'No autorizado' });
		}

		Object.assign(producto, req.body);
		const productoActualizado = await producto.save();
		res.json(productoActualizado);
	} catch (error) {
		res.status(500).json({ mensaje: error.message });
	}
};

// Eliminar producto (soft delete)
export const eliminarProducto = async (req, res) => {
	try {
		const producto = await Product.findById(req.params.id);
		if (!producto)
			return res.status(404).json({ mensaje: 'Producto no encontrado' });

		if (
			producto.vendedor.toString() !== req.user._id.toString() &&
			req.user.rol !== 'admin'
		) {
			return res.status(401).json({ mensaje: 'No autorizado' });
		}

		producto.activo = false;
		await producto.save();

		res.json({ mensaje: 'Producto eliminado correctamente' });
	} catch (error) {
		res.status(500).json({ mensaje: error.message });
	}
};
