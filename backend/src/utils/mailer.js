import nodemailer from 'nodemailer';

// Ensure environment variables are loaded by importing config where required
// (app imports config early so dotenv should already be configured)

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify()
  .then(() => console.log('Mailer is configured'))
  .catch((err) => console.error('Mailer verify failed:', err && err.message ? err.message : err));

export const sendMail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

export default sendMail;
