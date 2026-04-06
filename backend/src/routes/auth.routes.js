import express from 'express';
import { register, login, logout, forgotPassword, resetPassword, resetPasswordWithOtp } from '../controllers/auth.controller.js';
import sendMail from '../utils/mailer.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/reset-password-otp', resetPasswordWithOtp);

// Dev/test endpoint to verify mailer configuration
router.get('/send-test-mail', async (req, res) => {
	try {
		await sendMail({
			to: process.env.EMAIL_USER,
			subject: 'Backend test email',
			text: 'If you received this, nodemailer is working.'
		});
		res.status(200).json({ message: 'Test email sent' });
	} catch (err) {
		console.error('Test mail send failed:', err && err.message ? err.message : err);
		res.status(500).json({ message: 'Failed to send test email', error: err.message });
	}
});

export default router;
