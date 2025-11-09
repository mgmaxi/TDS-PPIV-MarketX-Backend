import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export const enviarEmail = async (to, subject, html) => {
	try {
		const info = await transporter.sendMail({
			from: `"MarketX" <${process.env.EMAIL_USER}>`,
			to,
			subject,
			html,
		});

		console.log('📨 Email enviado:', info.messageId);
		console.log('🔗 URL de vista previa:', nodemailer.getTestMessageUrl(info));
	} catch (error) {
		console.error('❌ Error al enviar email:', error.message);
	}
};
