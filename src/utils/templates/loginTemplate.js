export const loginTemplate = nombre => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>🔐 ¡Hola de nuevo, ${nombre}!</h2>
    <p>Se ha detectado un nuevo inicio de sesión en tu cuenta MarketX.</p>
    <p>Si fuiste vos, no hace falta hacer nada. Si no reconocés esta acción, por favor cambiate la contraseña.</p>
    <hr/>
    <p style="font-size: 12px; color: #777;">Seguridad ante todo 💪 — MarketX</p>
  </div>
`;
