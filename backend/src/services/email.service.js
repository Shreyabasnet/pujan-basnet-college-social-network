import crypto from "crypto";

// Generate raw token (send to email)
export const generateResetToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

// Mock email sender (replace with nodemailer later)
export const sendResetEmail = async (email, resetToken) => {
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `
You requested a password reset.

Click the link below to reset your password:
${resetUrl}

If you did not request this, please ignore this email.
`;

    console.log("=================================");
    console.log(`To: ${email}`);
    console.log("Subject: Password Reset");
    console.log(message);
    console.log("=================================");

    return new Promise((resolve) => setTimeout(resolve, 500));
};