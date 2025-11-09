export const pedidoActualizadoTemplate = (nombre, estado, pedidoId) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>📦 Actualización de pedido</h2>
    <p>Hola ${nombre}, el estado de tu pedido <strong>${pedidoId}</strong> ha cambiado a:</p>
    <h3 style="color: #007bff;">${estado.toUpperCase()}</h3>
    <p>Gracias por confiar en MarketX 🙌</p>
    <hr/>
    <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} MarketX</p>
  </div>
`;
