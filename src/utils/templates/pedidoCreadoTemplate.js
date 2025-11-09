export const pedidoCreadoTemplate = (nombre, pedidoId, total) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>🛒 ¡Gracias por tu compra, ${nombre}!</h2>
    <p>Tu pedido ha sido registrado correctamente en MarketX.</p>
    <p><strong>ID del pedido:</strong> ${pedidoId}</p>
    <p><strong>Total:</strong> $${total}</p>
    <p>En breve recibirás actualizaciones sobre el estado de tu pedido 📦</p>
    <hr/>
    <p style="font-size: 12px; color: #777;">Equipo MarketX</p>
  </div>
`;
