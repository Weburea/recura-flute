import nodemailer from 'nodemailer';

// Gmail SMTP transporter — uses your Gmail account to send emails.
// No domain purchase needed. Works on localhost + Vercel.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,   // your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not your normal password)
  },
});

const FROM_ADDRESS = `"Recura" <${process.env.GMAIL_USER}>`;

/**
 * Send the email-verification OTP to a newly-registered user.
 */
export async function sendVerificationEmail(
  toEmail: string,
  fullName: string,
  otpCode: string
) {
  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: toEmail,
    subject: 'Your Recura verification code',
    html: buildEmailHtml({
      title: 'Verify your email address',
      greeting: `Hi ${fullName}, welcome to Recura!`,
      body: `Enter the 6-digit code below in the app to activate your account. The code expires in <strong style="color:#e2e8f0;">10 minutes</strong>.`,
      otpCode,
      otpLabel: 'Your verification code',
      footer: "If you didn't create a Recura account, you can safely ignore this email.",
    }),
  });
}

/**
 * Send a password-reset OTP to an existing user.
 */
export async function sendPasswordResetEmail(
  toEmail: string,
  fullName: string,
  otpCode: string
) {
  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: toEmail,
    subject: 'Reset your Recura password',
    html: buildEmailHtml({
      title: 'Reset your password',
      greeting: `Hi ${fullName},`,
      body: `We received a request to reset your Recura password. Enter the 6-digit code below. It expires in <strong style="color:#e2e8f0;">10 minutes</strong>.`,
      otpCode,
      otpLabel: 'Your reset code',
      footer: "If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.",
    }),
  });
}

/* ─── Shared HTML email template ─── */
function buildEmailHtml({
  title,
  greeting,
  body,
  otpCode,
  otpLabel,
  footer,
}: {
  title: string;
  greeting: string;
  body: string;
  otpCode: string;
  otpLabel: string;
  footer: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0"
          style="background:linear-gradient(135deg,#13131f 0%,#1a1a2e 100%);
                 border:1px solid rgba(255,255,255,0.08);
                 border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:36px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:22px;font-weight:700;color:#a78bfa;">
                Recura
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#f1f5f9;">
                ${title}
              </h1>
              <p style="margin:0 0 28px;font-size:15px;color:#94a3b8;line-height:1.6;">
                ${greeting} ${body}
              </p>

              <!-- OTP Box -->
              <div style="background:rgba(167,139,250,0.08);border:1px solid rgba(167,139,250,0.25);
                          border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
                <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.1em;
                           text-transform:uppercase;color:#94a3b8;">${otpLabel}</p>
                <p style="margin:0;font-size:42px;font-weight:800;letter-spacing:0.18em;color:#a78bfa;">
                  ${otpCode}
                </p>
              </div>

              <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">
                ${footer}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:12px;color:#475569;text-align:center;">
                © 2026 Recura · All rights reserved
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}
