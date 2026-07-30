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

// Cloudinary Brand Images
const BANNER_IMAGE_URL = 'https://res.cloudinary.com/weburea/image/upload/v1785377325/Screenshot_2026-07-11_175204_ul4nwt.png';
const FOOTER_PATTERN_URL = 'https://res.cloudinary.com/weburea/image/upload/v1785379537/images/Public/recura_brand_pattern_footer_clean.png';

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
      body: `Enter the 6-digit verification code below to activate your account and start setting up your business billing workspace. The code expires in <strong style="color:#e2e8f0 !important;">10 minutes</strong>.`,
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
      body: `We received a request to reset your Recura password. Enter the 6-digit security code below to set a new password. The code expires in <strong style="color:#e2e8f0 !important;">10 minutes</strong>.`,
      otpCode,
      otpLabel: 'YOUR RESET CODE',
      footerText: "If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.",
    }),
  });
}

/* ─── Shared HTML Email Template (Robust Dark Mode + High Contrast Support) ─── */
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
  // Format 6-digit OTP code with spaces for maximum legibility (e.g., 8 4 9 2 0 4)
  const formattedCode = String(otpCode).split('').join(' ');

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    @media (prefers-color-scheme: dark) {
      .dark-card-bg { background-color: #130a27 !important; }
      .dark-body-bg { background-color: #0f0720 !important; }
      .dark-text-white { color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; }
      .dark-text-muted { color: #94a3b8 !important; -webkit-text-fill-color: #94a3b8 !important; }
      .dark-code-box { background-color: #211242 !important; border-color: rgba(167,139,250,0.5) !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#08040e;font-family:'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:28px 12px;background-color:#08040e;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" class="dark-card-bg"
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
            <td class="dark-body-bg" style="padding:32px 32px 28px;background-color:#0f0720;">
              
              <!-- Badge Pill -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td style="background-color:rgba(167,139,250,0.12);border:1px solid rgba(167,139,250,0.3);
                             border-radius:20px;padding:4px 14px;">
                    <p style="margin:0;font-size:11px;font-weight:800;letter-spacing:0.12em;color:#c084fc !important;-webkit-text-fill-color:#c084fc !important;text-transform:uppercase;">
                      ${badge}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Heading (Always White, Fits 1 Line on iPhone 12 Pro) -->
              <h1 class="dark-text-white" style="margin:0 0 12px;font-size:22px;font-weight:800;color:#ffffff !important;-webkit-text-fill-color:#ffffff !important;line-height:1.3;">
                ${title}
              </h1>

              <!-- Greeting & Body Text -->
              <p class="dark-text-muted" style="margin:0 0 24px;font-size:14px;color:#94a3b8 !important;-webkit-text-fill-color:#94a3b8 !important;line-height:1.6;font-weight:400;">
                <strong style="color:#e2e8f0 !important;-webkit-text-fill-color:#e2e8f0 !important;font-weight:600;">${greeting}</strong> ${body}
              </p>

              <!-- OTP CODE CONTAINER (Enforces High-Contrast Pure White Text on iOS & Android Dark Mode) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center" class="dark-code-box"
                      style="background-color:#211242;
                             border:1px solid rgba(167,139,250,0.4);
                             border-radius:16px;padding:26px 16px;text-align:center;">
                    <p style="margin:0 0 10px;font-size:11px;font-weight:800;letter-spacing:0.18em;
                               text-transform:uppercase;color:#c084fc !important;-webkit-text-fill-color:#c084fc !important;">
                      ${otpLabel}
                    </p>
                    <p style="margin:0;font-size:36px;font-weight:800;letter-spacing:0.18em;color:#ffffff !important;-webkit-text-fill-color:#ffffff !important;font-family:'Courier New',Courier,monospace;text-shadow:0 0 12px rgba(167,139,250,0.6);">
                      <span style="color:#ffffff !important;-webkit-text-fill-color:#ffffff !important;">${formattedCode}</span>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Footer Security Disclaimer -->
              <p class="dark-text-muted" style="margin:0;font-size:12px;color:#64748b !important;-webkit-text-fill-color:#64748b !important;line-height:1.6;">
                ${footerText}
              </p>
            </td>
          </tr>

          <!-- FOOTER PATTERN: Clean Recura Brand Pattern (Uploaded to Cloudinary images/Public/) -->
          <tr>
            <td style="padding:0;background-color:#08040e;border-top:1px solid rgba(255,255,255,0.08);">
              <div style="height:70px;overflow:hidden;width:100%;">
                <img src="${FOOTER_PATTERN_URL}" 
                     alt="Recura Pattern" 
                     width="520" 
                     style="display:block;width:100%;max-width:100%;height:70px;object-fit:cover;border:none;" />
              </div>
              <p style="margin:0;padding:12px 16px 14px;font-size:11px;color:#64748b !important;-webkit-text-fill-color:#64748b !important;text-align:center;background-color:#08040e;">
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
