import nodemailer from 'nodemailer';

function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP environment variables are not configured');
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendPasswordResetEmail(
  toEmail: string,
  resetToken: string
): Promise<void> {
  const appUrl = process.env.APP_URL ?? 'http://localhost:3000';
  const resetLink = `${appUrl}/reset-password?token=${resetToken}`;

  const transporter = createTransport();
  await transporter.sendMail({
    from: `"No Reply" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Reset your password',
    text: `You requested a password reset. Click the link below (valid for 1 hour):\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
    html: `
      <p>You requested a password reset. Click the button below (valid for 1 hour):</p>
      <p><a href="${resetLink}" style="background:#4f46e5;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;">Reset Password</a></p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });
}
