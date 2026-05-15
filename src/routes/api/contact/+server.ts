import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { name, email, message } = await request.json();

		if (!name || !email || !message) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: {
				user: env.EMAIL_USER,
				pass: env.EMAIL_PASS,
			},
		});

		const html = `
		<div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #0a0a0a; padding: 40px 0; color: #ffffff;">
			<div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 16px; overflow: hidden; border: 1px solid #333;">
				<div style="background-color: #00ff9d; color: #0a0a0a; padding: 24px 32px; text-align: center;">
					<h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.05em;">VELOCITY TERMINAL</h1>
				</div>

				<div style="padding: 32px;">
					<h2 style="color: #00ff9d; margin-bottom: 16px; font-size: 20px;">New Transmission Received</h2>
					<p style="color: #cccccc; font-size: 16px; line-height: 1.6;">
						You've received a new message from your portfolio site.
					</p>

					<div style="margin-top: 32px; padding: 24px; background-color: #222; border-radius: 12px; border-left: 4px solid #00ff9d;">
						<p style="margin: 0 0 12px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">From</p>
						<p style="margin: 0 0 24px 0; color: #ffffff; font-size: 18px; font-weight: 600;">${name} <span style="color: #00ff9d; font-weight: 400; font-size: 14px;">&lt;${email}&gt;</span></p>
						
						<p style="margin: 0 0 12px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Message</p>
						<p style="margin: 0; color: #ffffff; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
					</div>

					<div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 24px; text-align: center;">
						<p style="color: #666; font-size: 14px;">
							This message was sent via the Velocity Terminal Contact Form.
						</p>
					</div>
				</div>

				<div style="background-color: #0a0a0a; color: #444; text-align: center; padding: 16px; font-size: 11px; letter-spacing: 0.05em;">
					© ${new Date().getFullYear()} VELOCITY TERMINAL. ENCRYPTED TRANSMISSION.
				</div>
			</div>
		</div>
		`;

		await transporter.sendMail({
			from: `"Velocity Terminal" <${env.EMAIL_USER}>`,
			to: env.EMAIL_USER, // Sending to yourself
			replyTo: email,
			subject: `New Transmission from ${name}`,
			html,
		});

		return json({ success: true });
	} catch (error) {
		console.error('Email error:', error);
		return json({ error: 'Failed to send message' }, { status: 500 });
	}
};
