'use strict';

const nodemailer = require('nodemailer');

function createTransport() {
  const host = process.env.SMTP_HOST;

  // No SMTP configured → log to console (development mode)
  if (!host) {
    return nodemailer.createTransport({
      jsonTransport: true,
    });
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Send a password-reset email.
 * @param {string} toEmail  Recipient email address
 * @param {string} token    Raw reset token
 */
async function sendPasswordResetEmail(toEmail, token) {
  const resetUrl = `${process.env.APP_URL}/reset-password.html?token=${encodeURIComponent(token)}`;
  const expiryMinutes = process.env.RESET_TOKEN_EXPIRES_MINUTES || 30;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    to: toEmail,
    subject: 'Password Reset Request',
    text: `You requested a password reset.\n\nClick the link below to set a new password (valid for ${expiryMinutes} minutes):\n\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
    html: `
      <p>You requested a password reset.</p>
      <p>Click the button below to set a new password. This link is valid for <strong>${expiryMinutes} minutes</strong>.</p>
      <p><a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:4px;">Reset Password</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  };

  const transport = createTransport();
  const info = await transport.sendMail(mailOptions);

  // Development fallback — print the reset URL to the console
  if (!process.env.SMTP_HOST) {
    console.log('\n--- PASSWORD RESET EMAIL (dev mode) ---');
    console.log(`To: ${toEmail}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('---------------------------------------\n');
  }

  return info;
}

module.exports = { sendPasswordResetEmail };
