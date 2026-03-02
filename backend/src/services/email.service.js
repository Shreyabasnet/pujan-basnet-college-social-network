import crypto from 'crypto';

/**
 * Mock email sending function.
 * In a real application, you would use nodemailer or a service like SendGrid.
 */
export const sendResetEmail = async (email, resetToken) => {
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    console.log('-----------------------------------------');
    console.log(`To: ${email}`);
    console.log('Subject: Password Reset Request');
    console.log(`Content: You requested a password reset. Please click on this link to reset your password: ${resetUrl}`);
    console.log('-----------------------------------------');

    // Simulate async operation
    return new Promise((resolve) => setTimeout(resolve, 500));
};

export const generateResetToken = () => {
    return crypto.randomBytes(20).toString('hex');
};
