import Product from '../models/Product.js';

// 1. CREAR PRODUCTO
export const crearProducto = async (req, res) => {
	try {
		const { nombre, descripcion, precio, stock, categoria, imagen, activo } =
			req.body;

		const producto = new Product({
			nombre,
			descripcion,
			precio,
			stock,
			categoria,
			imagen,
			activo: activo !== undefined ? activo : true,
			vendedor: req.user._id,
		});

		const productoGuardado = await producto.save();
		res.status(201).json(productoGuardado);
	} catch (error) {
		console.error('Error al crear producto:', error);
		res
			.status(500)
			.json({ mensaje: 'Error al guardar el producto', error: error.message });
	}
};

// 2. OBTENER PRODUCTOS
export const obtenerProductos = async (req, res) => {
	try {
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		// Filtros
		const filtro = {};

		// Filtro por Vendedor
		if (req.query.vendedor) {
			filtro.vendedor = req.query.vendedor;
		}

		// Búsqueda por nombre
		if (req.query.nombre) {
			filtro.nombre = { $regex: req.query.nombre, $options: 'i' };
		}

		if (req.query.categoria) {
			filtro.categoria = req.query.categoria;
		}

		// Rangos de precio
		if (req.query.min || req.query.max) {
			filtro.precio = {};
			if (req.query.min) filtro.precio.$gte = Number(req.query.min);
			if (req.query.max) filtro.precio.$lte = Number(req.query.max);
		}

		// Ordenamiento
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

		const total = await Product.countDocuments(filtro);
		const productos = await Product.find(filtro)
			.populate('vendedor', 'nombre email')
			.skip(skip)
			.limit(limit)
			.sort({ [ordenCampo]: direccion });

		res.json({
			page,
			total,
			totalPaginas: Math.ceil(total / limit),
			resultados: productos.length,
			orden: { campo: ordenCampo, direccion },
			productos,
		});
	} catch (error) {
		console.error('Error en obtenerProductos:', error);
		res
			.status(500)
			.json({ mensaje: 'Error al obtener productos', error: error.message });
	}
};

// 3. OBTENER POR ID
export const obtenerProductoPorId = async (req, res) => {
	try {
		const producto = await Product.findById(req.params.id).populate(
			'vendedor',
			'nombre email'
		);

		if (!producto)
			return res.status(404).json({ mensaje: 'Producto no encontrado' });

		res.json(producto);
	} catch (error) {
		res.status(500).json({ mensaje: error.message });
	}
};

// 4. ACTUALIZAR (Sirve para Editar y para Activar/Desactivar)
export const actualizarProducto = async (req, res) => {
	try {
		const producto = await Product.findById(req.params.id);
		if (!producto)
			return res.status(404).json({ mensaje: 'Producto no encontrado' });

		// Permisos
		if (
			producto.vendedor.toString() !== req.user._id.toString() &&
			req.user.rol !== 'admin'
		) {
			return res
				.status(401)
				.json({ mensaje: 'No tienes permiso para editar este producto' });
		}

		// Aquí se actualiza todo, incluido si el frontend manda "activo: false"
		Object.assign(producto, req.body);

		const productoActualizado = await producto.save();
		res.json(productoActualizado);
	} catch (error) {
		console.error('Error al actualizar:', error);
		res.status(500).json({ mensaje: error.message });
	}
};

// 5. ELIMINAR PRODUCTO (HARD DELETE)
export const eliminarProducto = async (req, res) => {
	try {
		// 1. Buscamos el producto primero
		const producto = await Product.findById(req.params.id);

		if (!producto)
			return res.status(404).json({ mensaje: 'Producto no encontrado' });

		// 2. Verificamos permisos (Seguridad crítica)
		if (
			producto.vendedor.toString() !== req.user._id.toString() &&
			req.user.rol !== 'admin'
		) {
			return res
				.status(401)
				.json({ mensaje: 'No tienes permiso para eliminar este producto' });
		}

		// 3. BORRADO REAL DE LA BASE DE DATOS
		await producto.deleteOne();

		res.json({
			mensaje: 'Producto eliminado permanentemente de la base de datos',
		});
	} catch (error) {
		console.error('Error al eliminar:', error);
		res.status(500).json({ mensaje: error.message });
	}
};
