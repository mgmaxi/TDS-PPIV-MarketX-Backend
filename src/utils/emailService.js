import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_SMTP,
	port: Number(process.env.EMAIL_PORT) || 587,
	secure: false, // usa TLS
	auth: {
		user: process.env.EMAIL_LOGIN,
		pass: process.env.EMAIL_PASS,
	},
});

export const enviarEmail = async (to, subject, html) => {
	try {
		await transporter.verify();
		const info = await transporter.sendMail({
			from: process.env.EMAIL_FROM,
			to,
			subject,
			html,
		});
		console.log(`📨 Email enviado correctamente a ${to}`);
		console.log(`🧾 Message ID: ${info.messageId}`);
	} catch (error) {
		console.error('❌ Error al enviar email:', error.message);
	}
};
