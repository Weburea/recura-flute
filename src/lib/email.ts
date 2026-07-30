import nodemailer from 'nodemailer';

function getTransporter() {
  const user = process.env.GMAIL_USER || 'webureaagency@gmail.com';
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!pass) {
    console.warn('[EMAIL SERVICE WARNING] GMAIL_APP_PASSWORD is missing from Vercel Environment Variables!');
  }

  return {
    transporter: nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    }),
    fromAddress: `"Recura" <${user}>`,
  };
}

// Cloudinary Brand Images (Footer pattern cropped via Cloudinary URL transformation to remove "Brand Pattern" text box)
const BANNER_IMAGE_URL = 'https://res.cloudinary.com/weburea/image/upload/v1785377325/Screenshot_2026-07-11_175204_ul4nwt.png';
const FOOTER_PATTERN_URL = 'https://res.cloudinary.com/weburea/image/upload/c_crop,g_north,h_130/v1785377300/weburea_1778207917_fc124b30_vrf3lg.png';

/**
 * Send the email-verification OTP to a newly-registered user.
 */
export async function sendVerificationEmail(
  toEmail: string,
  fullName: string,
  otpCode: string
) {
  const { transporter, fromAddress } = getTransporter();

  await transporter.sendMail({
    from: fromAddress,
    to: toEmail,
    subject: 'Your Recura Verification Code',
    html: buildEmailHtml({
      badge: 'ACCOUNT VERIFICATION',
      title: 'Verify your email address',
      greeting: `Hi ${fullName}, welcome to Recura!`,
      body: `Enter the 6-digit verification code below to activate your account and start setting up your business billing workspace. The code expires in <strong style="color:#e2e8f0;">10 minutes</strong>.`,
      otpCode,
      otpLabel: 'YOUR VERIFICATION CODE',
      footerText: "If you didn't create a Recura account, you can safely ignore this message.",
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
  const { transporter, fromAddress } = getTransporter();

  await transporter.sendMail({
    from: fromAddress,
    to: toEmail,
    subject: 'Reset your Recura password',
    html: buildEmailHtml({
      badge: 'PASSWORD RESET',
      title: 'Reset your password',
      greeting: `Hi ${fullName},`,
      body: `We received a request to reset your Recura password. Enter the 6-digit security code below to set a new password. The code expires in <strong style="color:#e2e8f0;">10 minutes</strong>.`,
      otpCode,
      otpLabel: 'YOUR RESET CODE',
      footerText: "If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.",
    }),
  });
}

/* ─── Shared HTML Email Template ─── */
function buildEmailHtml({
  badge,
  title,
  greeting,
  body,
  otpCode,
  otpLabel,
  footerText,
}: {
  badge: string;
  title: string;
  greeting: string;
  body: string;
  otpCode: string;
  otpLabel: string;
  footerText: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#08040e;font-family:'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:28px 12px;background-color:#08040e;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0"
          style="max-width:520px;width:100%;background-color:#130a27;
                 border:1px solid rgba(167,139,250,0.22);
                 border-radius:20px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.5);">

          <!-- HEADER BANNER: Recura Purple Logo Image -->
          <tr>
            <td style="padding:0;background-color:#6c5ce7;text-align:center;">
              <img src="${BANNER_IMAGE_URL}" 
                   alt="Recura" 
                   width="520" 
                   style="display:block;width:100%;max-width:100%;height:auto;border:none;" />
            </td>
          </tr>

          <!-- BODY CONTENT -->
          <tr>
            <td style="padding:32px 32px 28px;background:linear-gradient(180deg,#130a27 0%,#0f0720 100%);">
              
              <!-- Badge Pill -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td style="background-color:rgba(167,139,250,0.12);border:1px solid rgba(167,139,250,0.3);
                             border-radius:20px;padding:4px 14px;">
                    <p style="margin:0;font-size:11px;font-weight:800;letter-spacing:0.12em;color:#c084fc;text-transform:uppercase;">
                      ${badge}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Heading (Responsive font size for iPhone 12 Pro) -->
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#f8fafc;line-height:1.3;">
                ${title}
              </h1>

              <!-- Greeting & Body Text -->
              <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.6;font-weight:400;">
                <strong style="color:#e2e8f0;font-weight:600;">${greeting}</strong> ${body}
              </p>

              <!-- OTP CODE CONTAINER (Guaranteed White Code Text on All Email Clients) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center" 
                      style="background:linear-gradient(135deg,rgba(167,139,250,0.12) 0%,rgba(139,92,246,0.06) 100%);
                             border:1px solid rgba(167,139,250,0.3);
                             border-radius:14px;padding:24px 16px;text-align:center;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.15em;
                               text-transform:uppercase;color:#a78bfa;">
                      ${otpLabel}
                    </p>
                    <p style="margin:0;font-size:38px;font-weight:800;letter-spacing:0.25em;color:#ffffff !important;-webkit-text-fill-color:#ffffff !important;font-family:'Courier New',Courier,monospace;text-shadow:0 0 16px rgba(167,139,250,0.5);">
                      <span style="color:#ffffff !important;-webkit-text-fill-color:#ffffff !important;">${otpCode}</span>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Footer Security Disclaimer -->
              <p style="margin:0;font-size:12px;color:#64748b;line-height:1.6;">
                ${footerText}
              </p>
            </td>
          </tr>

          <!-- FOOTER PATTERN: Pure Brand Pattern (Text box cropped out via Cloudinary transformation) -->
          <tr>
            <td style="padding:0;background-color:#0b0518;border-top:1px solid rgba(255,255,255,0.06);">
              <div style="height:65px;overflow:hidden;width:100%;">
                <img src="${FOOTER_PATTERN_URL}" 
                     alt="Recura Pattern" 
                     width="520" 
                     style="display:block;width:100%;max-width:100%;height:65px;object-fit:cover;opacity:0.85;border:none;" />
              </div>
              <p style="margin:0;padding:12px 16px 14px;font-size:11px;color:#475569;text-align:center;background-color:#08040e;">
                © 2026 Recura · Automated Retainers & Subscription Management
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
