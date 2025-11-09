import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
	{
		usuario: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		productos: [
			{
				producto: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
				cantidad: { type: Number, required: true },
				precioUnitario: { type: Number, required: true },
			},
		],
		total: { type: Number, required: true },
		metodoPago: {
			type: String,
			enum: ['efectivo', 'tarjeta', 'transferencia'],
			default: 'efectivo',
		},
		estado: {
			type: String,
			enum: ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'],
			default: 'pendiente',
		},
	},
	{ timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
