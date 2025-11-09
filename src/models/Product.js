import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
	{
		nombre: { type: String, required: true },
		descripcion: { type: String, required: true },
		precio: { type: Number, required: true },
		stock: { type: Number, required: true, default: 0 },
		categoria: { type: String, required: true },
		imagen: { type: String, default: '' },
		vendedor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		activo: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
