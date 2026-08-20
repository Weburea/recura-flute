"use client"

import * as React from "react"
import { 
  Mail, 
  Smartphone, 
  Monitor, 
  Check, 
  Code,
  Sparkles,
  Link2
} from "lucide-react"
import { cn } from "@/lib/utils"

// 1. Static HTML Template Definitions for previews
const BANNER_IMAGE_URL = 'https://res.cloudinary.com/weburea/image/upload/v1786379732/email_banner_welcome_gdozxc.png';
const FOOTER_PATTERN_URL = 'https://res.cloudinary.com/weburea/image/upload/v1785379537/images/Public/recura_brand_pattern_footer_clean.png';

function buildOtpEmailHtml({
  badge,
  title,
  greeting,
  body,
  otpCode,
  otpLabel,
  footerText,
  bannerUrl,
}: {
  badge: string
  title: string
  greeting: string
  body: string
  otpCode: string
  otpLabel: string
  footerText: string
  bannerUrl?: string
}) {
  const currentBanner = bannerUrl || "https://res.cloudinary.com/weburea/image/upload/v1786379729/registration_design_eqbm4v.png";
  const formattedCode = String(otpCode).split('').join('&nbsp;');
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width: 480px) {
      body {
        overflow-x: hidden !important;
      }
      .responsive-table {
        width: 100% !important;
        max-width: 100% !important;
      }
      .responsive-body {
        padding: 20px 16px !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f1fa;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table id="email-root" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 8px;background-color:#f4f1fa;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="560" cellpadding="0" cellspacing="0" class="responsive-table"
          style="max-width:560px;width:100%;background-color:#ffffff;
                 border:1px solid #e2e8f0;
                 border-radius:24px;overflow:hidden;box-shadow:0 10px 25px rgba(108,92,231,0.05);">

          <!-- HEADER BANNER: Verify OTP Banner -->
          <tr>
            <td style="padding:0;background-color:#ffffff;text-align:center;">
              <img src="${currentBanner}" 
                   alt="Email Banner" 
                   width="560" 
                   style="display:block;width:100%;max-width:100%;height:auto;border:none;margin:0;" />
            </td>
          </tr>

          <!-- BODY CONTENT -->
          <tr>
            <td class="responsive-body" style="padding:32px 32px 24px;background-color:#ffffff;">
              
              <!-- BADGE -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;border-collapse:separate;">
                <tr>
                  <td style="background-color:#f3e8ff;border:1px solid #e9d5ff;border-radius:12px;padding:4px 12px;">
                    <p style="margin:0;font-size:10px;font-weight:800;letter-spacing:0.12em;color:#a855f7;text-transform:uppercase;">
                      ${badge}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- TITLE -->
              <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#150B2D;line-height:1.25;text-align:left;">
                ${title}
              </h1>
              
              <!-- DESCRIPTION -->
              <p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.6;font-weight:400;">
                <strong style="color:#150B2D;">${greeting}</strong> ${body}
              </p>

              <!-- OTP CODE DISPLAY BOX -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-collapse:collapse;">
                <tr>
                  <td align="center" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;padding:24px 16px;text-align:center;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;color:#8b5cf6;">
                      ${otpLabel}
                    </p>
                    <p style="margin:0;font-size:32px;font-weight:800;letter-spacing:0.15em;color:#150B2D;font-family:'Courier New',Courier,monospace;white-space:nowrap !important;">
                      <span style="color:#150B2D;white-space:nowrap !important;display:inline-block !important;">${formattedCode}</span>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- FOOTER TEXT -->
              <p style="margin:0;font-size:12px;color:#64748b;line-height:1.6;text-align:left;">
                ${footerText}
              </p>

            </td>
          </tr>

          <!-- FOOTER: Recura Brand Pattern & Company details -->
          <tr>
            <td style="padding:0;background-color:#0d0518;border-top:1px solid #e2e8f0;">
              <div style="height:50px;overflow:hidden;width:100%;">
                <img src="${FOOTER_PATTERN_URL}" 
                     alt="Recura Pattern" 
                     width="560" 
                     style="display:block;width:100%;max-width:100%;height:50px;object-fit:cover;border:none;" />
              </div>
              
              <!-- Footer text contents -->
              <div style="padding:24px 32px 32px;background-color:#0d0518;">
                
                <!-- Social media text links -->
                <div style="margin: 0 auto 16px; text-align: center; font-size: 11px; font-weight: 700; line-height: 1.8;">
                  <a href="https://twitter.com/recura" target="_blank" style="color: #a78bfa; text-decoration: none; display: inline-block; white-space: nowrap; margin: 0 8px 6px; vertical-align: middle;">
                    <img src="https://img.icons8.com/ios-glyphs/30/a78bfa/twitter--v1.png" width="14" height="14" style="vertical-align: middle; margin-right: 4px; border: none; display: inline-block;" alt="" />
                    Twitter
                  </a>
                  <span style="color: #4b5563; margin: 0 4px; display: inline-block; vertical-align: middle;">&bull;</span>
                  <a href="https://facebook.com/recura" target="_blank" style="color: #a78bfa; text-decoration: none; display: inline-block; white-space: nowrap; margin: 0 8px 6px; vertical-align: middle;">
                    <img src="https://img.icons8.com/ios-glyphs/30/a78bfa/facebook-new.png" width="14" height="14" style="vertical-align: middle; margin-right: 4px; border: none; display: inline-block;" alt="" />
                    Facebook
                  </a>
                  <span style="color: #4b5563; margin: 0 4px; display: inline-block; vertical-align: middle;">&bull;</span>
                  <a href="https://linkedin.com/company/recura" target="_blank" style="color: #a78bfa; text-decoration: none; display: inline-block; white-space: nowrap; margin: 0 8px 6px; vertical-align: middle;">
                    <img src="https://img.icons8.com/ios-glyphs/30/a78bfa/linkedin-2.png" width="14" height="14" style="vertical-align: middle; margin-right: 4px; border: none; display: inline-block;" alt="" />
                    LinkedIn
                  </a>
                  <span style="color: #4b5563; margin: 0 4px; display: inline-block; vertical-align: middle;">&bull;</span>
                  <a href="https://instagram.com/recura" target="_blank" style="color: #a78bfa; text-decoration: none; display: inline-block; white-space: nowrap; margin: 0 8px 6px; vertical-align: middle;">
                    <img src="https://img.icons8.com/ios-glyphs/30/a78bfa/instagram-new.png" width="14" height="14" style="vertical-align: middle; margin-right: 4px; border: none; display: inline-block;" alt="" />
                    Instagram
                  </a>
                </div>

                <p style="margin: 0 0 12px; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.5;">
                  <a href="http://localhost:4000/privacy" target="_blank" style="color: #a78bfa; text-decoration: underline;">Privacy Policy</a> &nbsp;&bull;&nbsp;
                  <a href="http://localhost:4000/support" target="_blank" style="color: #a78bfa; text-decoration: underline;">Support</a> &nbsp;&bull;&nbsp;
                  <a href="http://localhost:4000/invite" target="_blank" style="color: #a78bfa; text-decoration: underline;">Invite Friends</a> &nbsp;&bull;&nbsp;
                  <a href="http://localhost:4000/inspired" target="_blank" style="color: #a78bfa; text-decoration: underline;">Get Inspired</a>
                </p>

                <p style="margin: 0; font-size: 10px; color: #64748b; text-align: center; line-height: 1.5;">
                  Recura Technologies Inc. &bull; Lagos, Nigeria &bull; Postal Code 100001
                </p>
                
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}function buildWelcomeEmailHtml(fullName: string, businessName: string, businessType: string) {
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Recura</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width: 480px) {
      body {
        overflow-x: hidden !important;
      }
      .responsive-table {
        width: 100% !important;
        max-width: 100% !important;
      }
      .responsive-cell {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        padding-bottom: 16px !important;
        box-sizing: border-box !important;
      }
      .responsive-cell table,
      .responsive-cell tbody,
      .responsive-cell tr,
      .responsive-cell td {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .responsive-cell table td[valign="top"] {
        padding: 16px !important;
        height: auto !important;
      }
      .responsive-cell img {
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
        display: block !important;
      }
      .responsive-grid,
      .responsive-grid tbody,
      .responsive-tr {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .responsive-body {
        padding: 20px 16px !important;
      }
      .horizontal-card-row {
        display: block !important;
        margin-bottom: 24px !important;
      }
      .card-img-cell {
        display: table-cell;
      }
      .card-text-cell {
        display: table-cell;
      }
      @media only screen and (max-width: 480px) {
        .card-img-cell {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          padding-right: 0 !important;
          padding-bottom: 12px !important;
          text-align: center !important;
        }
        .card-img-cell img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
          margin: 0 auto !important;
        }
        .card-text-cell {
          display: block !important;
          width: 100% !important;
          padding-left: 0 !important;
          box-sizing: border-box !important;
        }
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f1fa;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table id="email-root" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 8px;background-color:#f4f1fa;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="560" cellpadding="0" cellspacing="0" class="responsive-table"
          style="max-width:560px;width:100%;background-color:#ffffff;
                 border:1px solid #e2e8f0;
                 border-radius:24px;overflow:hidden;box-shadow:0 10px 25px rgba(108,92,231,0.05);">

          <!-- HEADER BANNER: Welcome Banner -->
          <tr>
            <td style="padding:0;background-color:#ffffff;text-align:center;">
              <img src="${BANNER_IMAGE_URL}" 
                   alt="Welcome to Recura" 
                   width="560" 
                   style="display:block;width:100%;max-width:100%;height:auto;border:none;margin:0;" />
            </td>
          </tr>

          <!-- BODY CONTENT -->
          <tr>
            <td class="responsive-body" style="padding:32px 32px 24px;background-color:#ffffff;">
              <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#150B2D;line-height:1.25;text-align:left;">
                Welcome to Recura, <span style="color:#6c5ce7;">${fullName}</span>!
              </h1>
              
              <p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.6;font-weight:400;">
                Your workspace, <strong style="color:#6c5ce7;">${businessName}</strong>, is officially set up and ready to power your <strong style="color:#6c5ce7;">${businessType}</strong> hub.
              </p>

              <!-- SECTION: Explore Recura Resources -->
              <h2 style="margin:0 0 8px;font-size:16px;font-weight:800;color:#150B2D;letter-spacing:0.05em;text-transform:uppercase;">
                Explore Recura Resources
              </h2>
              <p style="margin:0 0 24px;font-size:13px;color:#64748b;line-height:1.5;">
                Recura adapts to your business model with resources, operations, and developer guides:
              </p>

              <!-- RESOURCES LIST (HORIZONTAL CARDS) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px; border-collapse: collapse;">
                <!-- Card 1: Billing Basics -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; border-collapse: collapse;">
                      <tr>
                        <!-- Left Image Column -->
                        <td class="card-img-cell" width="180" valign="middle" style="padding: 12px 0 12px 12px; width: 180px;">
                          <a href="https://recura-ten.vercel.app/resources/billing-basics" target="_blank" style="text-decoration: none; display: block;">
                            <img src="https://res.cloudinary.com/weburea/image/upload/v1786562681/Billing_jjtg9i.png" 
                                 alt="Billing Basics" 
                                 width="180" 
                                 height="115"
                                 style="display:block; width:180px; height:115px; object-fit:cover; object-position:left center; border-radius:12px; border:none; margin:0; pointer-events:none; -webkit-user-drag:none; -webkit-touch-callout:none; -webkit-user-select:none; user-select:none;" />
                          </a>
                        </td>
                        <!-- Right Text Column -->
                        <td class="card-text-cell" valign="middle" style="padding: 16px 16px 16px 20px; text-align: left;">
                          <p style="margin:0 0 4px; font-size:10px; font-weight:800; letter-spacing:0.05em; color:#d97706; text-transform:uppercase;">
                            &mdash; Billing Basics
                          </p>
                          <h3 style="margin:0 0 6px; font-size:15px; font-weight:700; color:#150B2D; line-height:1.3; display:block;">
                            The foundations of subscription billing
                          </h3>
                          <p style="margin:0; font-size:12px; color:#64748b; line-height:1.5; display:block;">
                            Learn subscription models, billing cycles, proration, and recurring revenue before you configure active workspace settings... 
                            <a href="https://recura-ten.vercel.app/resources/billing-basics" target="_blank" style="color:#6c5ce7; text-decoration:none; font-weight:700; white-space:nowrap;">Read more</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Card 2: Invoicing Operations -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; border-collapse: collapse;">
                      <tr>
                        <!-- Left Image Column -->
                        <td class="card-img-cell" width="180" valign="middle" style="padding: 12px 0 12px 12px; width: 180px;">
                          <a href="https://recura-ten.vercel.app/resources/invoicing-operations" target="_blank" style="text-decoration: none; display: block;">
                            <img src="https://res.cloudinary.com/weburea/image/upload/v1786562681/Invoicing_eugl6y.png" 
                                 alt="Invoicing Operations" 
                                 width="180" 
                                 height="115"
                                 style="display:block; width:180px; height:115px; object-fit:cover; object-position:left center; border-radius:12px; border:none; margin:0; pointer-events:none; -webkit-user-drag:none; -webkit-touch-callout:none; -webkit-user-select:none; user-select:none;" />
                          </a>
                        </td>
                        <!-- Right Text Column -->
                        <td class="card-text-cell" valign="middle" style="padding: 16px 16px 16px 20px; text-align: left;">
                          <p style="margin:0 0 4px; font-size:10px; font-weight:800; letter-spacing:0.05em; color:#059669; text-transform:uppercase;">
                            &mdash; Invoicing Operations
                          </p>
                          <h3 style="margin:0 0 6px; font-size:15px; font-weight:700; color:#150B2D; line-height:1.3; display:block;">
                            Invoicing that runs itself
                          </h3>
                          <p style="margin:0; font-size:12px; color:#64748b; line-height:1.5; display:block;">
                            Configure automated invoicing, handle credit notes, manage multi-currency billing, and generate audit-ready financial records here... 
                            <a href="https://recura-ten.vercel.app/resources/invoicing-operations" target="_blank" style="color:#6c5ce7; text-decoration:none; font-weight:700; white-space:nowrap;">Read more</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Card 3: Payment Collection -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; border-collapse: collapse;">
                      <tr>
                        <!-- Left Image Column -->
                        <td class="card-img-cell" width="180" valign="middle" style="padding: 12px 0 12px 12px; width: 180px;">
                          <a href="https://recura-ten.vercel.app/resources/payment-collection" target="_blank" style="text-decoration: none; display: block;">
                            <img src="https://res.cloudinary.com/weburea/image/upload/v1786562681/Payment_lsy8qh.png" 
                                 alt="Payment Collection" 
                                 width="180" 
                                 height="115"
                                 style="display:block; width:180px; height:115px; object-fit:cover; object-position:left center; border-radius:12px; border:none; margin:0; pointer-events:none; -webkit-user-drag:none; -webkit-touch-callout:none; -webkit-user-select:none; user-select:none;" />
                          </a>
                        </td>
                        <!-- Right Text Column -->
                        <td class="card-text-cell" valign="middle" style="padding: 16px 16px 16px 20px; text-align: left;">
                          <p style="margin:0 0 4px; font-size:10px; font-weight:800; letter-spacing:0.05em; color:#db2777; text-transform:uppercase;">
                            &mdash; Payment Collection
                          </p>
                          <h3 style="margin:0 0 6px; font-size:15px; font-weight:700; color:#150B2D; line-height:1.3; display:block;">
                            Recover more revenue, automatically
                          </h3>
                          <p style="margin:0; font-size:12px; color:#64748b; line-height:1.5; display:block;">
                            Configure Recura's dunning engine, retry logic, and card updater to recover failed subscription payments automatically... 
                            <a href="https://recura-ten.vercel.app/resources/payment-collection" target="_blank" style="color:#6c5ce7; text-decoration:none; font-weight:700; white-space:nowrap;">Read more</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Card 4: API & Developers -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; border-collapse: collapse;">
                      <tr>
                        <!-- Left Image Column -->
                        <td class="card-img-cell" width="180" valign="middle" style="padding: 12px 0 12px 12px; width: 180px;">
                          <a href="https://recura-ten.vercel.app/resources/api-developers" target="_blank" style="text-decoration: none; display: block;">
                            <img src="https://res.cloudinary.com/weburea/image/upload/v1786562681/Api_mtdoaf.png" 
                                 alt="API & Developers" 
                                 width="180" 
                                 height="115"
                                 style="display:block; width:180px; height:115px; object-fit:cover; object-position:left center; border-radius:12px; border:none; margin:0; pointer-events:none; -webkit-user-drag:none; -webkit-touch-callout:none; -webkit-user-select:none; user-select:none;" />
                          </a>
                        </td>
                        <!-- Right Text Column -->
                        <td class="card-text-cell" valign="middle" style="padding: 16px 16px 16px 20px; text-align: left;">
                          <p style="margin:0 0 4px; font-size:10px; font-weight:800; letter-spacing:0.05em; color:#7c3aed; text-transform:uppercase;">
                            &mdash; API & Developers
                          </p>
                          <h3 style="margin:0 0 6px; font-size:15px; font-weight:700; color:#150B2D; line-height:1.3; display:block;">
                            Build anything on top of Recura
                          </h3>
                          <p style="margin:0; font-size:12px; color:#64748b; line-height:1.5; display:block;">
                            Integrate our complete REST API, typed SDKs, webhook documentation, and integration guides for every platform... 
                            <a href="https://recura-ten.vercel.app/resources/api-developers" target="_blank" style="color:#6c5ce7; text-decoration:none; font-weight:700; white-space:nowrap;">Read more</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- EXPLORE RESOURCES BUTTON -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;border-collapse:collapse;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" style="border-collapse:separate;margin:0 auto;">
                      <tr>
                        <td align="center" style="border-radius:12px;background:linear-gradient(to right, #6366f1, #a855f7, #ec4899);background-color:#6366f1;box-shadow:0 8px 20px rgba(168,85,247,0.25);">
                          <a href="https://recura-ten.vercel.app/resources" target="_blank" 
                             style="display:inline-block;padding:14px 48px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.02em;border-radius:12px;border:none;text-shadow:0 1px 2px rgba(0,0,0,0.15);width:160px;text-align:center;">
                            Explore Resources
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER: Recura Brand Pattern & Company details -->
          <tr>
            <td style="padding:0;background-color:#0d0518;border-top:1px solid #e2e8f0;">
              <div style="height:50px;overflow:hidden;width:100%;">
                <img src="${FOOTER_PATTERN_URL}" 
                     alt="Recura Pattern" 
                     width="560" 
                     style="display:block;width:100%;max-width:100%;height:50px;object-fit:cover;border:none;" />
              </div>
              
              <!-- Footer text contents -->
              <div style="padding:24px 32px 32px;background-color:#0d0518;">
                
                <!-- Social media text links -->
                <div style="margin: 0 auto 16px; text-align: center; font-size: 11px; font-weight: 700; line-height: 1.8;">
                  <a href="https://twitter.com/recura" target="_blank" style="color: #a78bfa; text-decoration: none; display: inline-block; white-space: nowrap; margin: 0 8px 6px; vertical-align: middle;">
                    <img src="https://img.icons8.com/ios-glyphs/30/a78bfa/twitter--v1.png" width="14" height="14" style="vertical-align: middle; margin-right: 4px; border: none; display: inline-block;" alt="" />
                    Twitter
                  </a>
                  <span style="color: #4b5563; margin: 0 4px; display: inline-block; vertical-align: middle;">&bull;</span>
                  <a href="https://facebook.com/recura" target="_blank" style="color: #a78bfa; text-decoration: none; display: inline-block; white-space: nowrap; margin: 0 8px 6px; vertical-align: middle;">
                    <img src="https://img.icons8.com/ios-glyphs/30/a78bfa/facebook-new.png" width="14" height="14" style="vertical-align: middle; margin-right: 4px; border: none; display: inline-block;" alt="" />
                    Facebook
                  </a>
                  <span style="color: #4b5563; margin: 0 4px; display: inline-block; vertical-align: middle;">&bull;</span>
                  <a href="https://linkedin.com/company/recura" target="_blank" style="color: #a78bfa; text-decoration: none; display: inline-block; white-space: nowrap; margin: 0 8px 6px; vertical-align: middle;">
                    <img src="https://img.icons8.com/ios-glyphs/30/a78bfa/linkedin-2.png" width="14" height="14" style="vertical-align: middle; margin-right: 4px; border: none; display: inline-block;" alt="" />
                    LinkedIn
                  </a>
                  <span style="color: #4b5563; margin: 0 4px; display: inline-block; vertical-align: middle;">&bull;</span>
                  <a href="https://instagram.com/recura" target="_blank" style="color: #a78bfa; text-decoration: none; display: inline-block; white-space: nowrap; margin: 0 8px 6px; vertical-align: middle;">
                    <img src="https://img.icons8.com/ios-glyphs/30/a78bfa/instagram-new.png" width="14" height="14" style="vertical-align: middle; margin-right: 4px; border: none; display: inline-block;" alt="" />
                    Instagram
                  </a>
                </div>

                <p style="margin: 0 0 12px; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.5;">
                  <a href="http://localhost:4000/privacy" target="_blank" style="color: #a78bfa; text-decoration: underline;">Privacy Policy</a> &nbsp;&bull;&nbsp;
                  <a href="http://localhost:4000/support" target="_blank" style="color: #a78bfa; text-decoration: underline;">Support</a> &nbsp;&bull;&nbsp;
                  <a href="http://localhost:4000/invite" target="_blank" style="color: #a78bfa; text-decoration: underline;">Invite Friends</a> &nbsp;&bull;&nbsp;
                  <a href="http://localhost:4000/inspired" target="_blank" style="color: #a78bfa; text-decoration: underline;">Get Inspired</a>
                </p>

                <p style="margin: 0; font-size: 10px; color: #64748b; text-align: center; line-height: 1.5;">
                  Recura Technologies Inc. &bull; Lagos, Nigeria &bull; Postal Code 100001
                </p>
                
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Inject a postMessage reporter into the srcDoc HTML so the parent can safely
// measure iframe height without triggering cross-origin SecurityErrors.
function injectHeightReporter(html: string): string {
  const script = `<script>
    function reportHeight() {
      var root = document.getElementById('email-root');
      var h = root ? root.offsetHeight : (document.body.scrollHeight || document.documentElement.scrollHeight);
      window.parent.postMessage({ type: 'iframe-height', height: h }, '*');
    }
    document.addEventListener('DOMContentLoaded', reportHeight);
    window.addEventListener('load', reportHeight);
    // Also watch for any late image loads
    var imgs = document.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].addEventListener('load', reportHeight);
    }
    // Run immediately
    reportHeight();
    // Run again slightly delayed for layout updates
    setTimeout(reportHeight, 50);
    setTimeout(reportHeight, 150);
  <\/script>`;
  // Insert just before </body> if present, otherwise append
  if (html.includes('</body>')) {
    return html.replace('</body>', script + '</body>');
  }
  return html + script;
}

const getDefaultHeight = (template: string, mode: string) => {
  if (template === "welcome") {
    return mode === "desktop" ? 1050 : 1380;
  }
  if (template === "subscription") {
    return 200;
  }
  // OTP Verification templates (Verify & Forgot) are now card layouts, height ~640px
  return mode === "desktop" ? 640 : 660;
};

export function EmailTemplatesDoc() {
  const [activeTemplate, setActiveTemplate] = React.useState<"welcome" | "verify" | "forgot" | "subscription">("welcome")
  const [viewMode, setViewMode] = React.useState<"desktop" | "mobile">("desktop")
  const [copied, setCopied] = React.useState(false)
  const [iframeHeight, setIframeHeight] = React.useState(() => getDefaultHeight("welcome", "desktop"))

  // Listen for the safe postMessage height report from inside the iframe srcDoc
  React.useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'iframe-height' && typeof e.data.height === 'number') {
        setIframeHeight(e.data.height + 24)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  // Reset to a safe default whenever the template or viewport changes
  React.useEffect(() => {
    setIframeHeight(getDefaultHeight(activeTemplate, viewMode))
  }, [activeTemplate, viewMode])

  const emailTemplates = {
    welcome: {
      name: "Welcome Email",
      subject: "Welcome to Recura, HARMONY!",
      badge: "Onboarding Finalized",
      description: "Triggered immediately after user onboarding completion. Uses a modern light layout displaying the primary CTA and available business solutions.",
      html: buildWelcomeEmailHtml("HARMONY", "GOOD", "Social Media Agency")
    },
    verify: {
      name: "Verify Email OTP",
      subject: "Your Recura Verification Code",
      badge: "Account Creation",
      description: "Sends a 6-digit one-time code to confirm email verification during user registration.",
      html: buildOtpEmailHtml({
        badge: "ACCOUNT VERIFICATION",
        title: "Verify your email address",
        greeting: "Hi HARMONY, welcome to Recura!",
        body: "Enter the 6-digit verification code below to activate your account. The code expires in <strong style='color:#6c5ce7 !important;'>60 seconds</strong>.",
        otpCode: "492015",
        otpLabel: "YOUR VERIFICATION CODE",
        footerText: "If you didn't create a Recura account, you can safely ignore this message."
      })
    },
    forgot: {
      name: "Forgot Password OTP",
      subject: "Reset your Recura password",
      badge: "User Security",
      description: "Provides a secure password reset token when requested by an existing user profile.",
      html: buildOtpEmailHtml({
        badge: "PASSWORD RESET",
        title: "Reset your password",
        greeting: "Hi HARMONY,",
        body: "We received a request to reset your Recura password. Enter the 6-digit code below to set a new password. The code expires in <strong style='color:#6c5ce7 !important;'>60 seconds</strong>.",
        otpCode: "827409",
        otpLabel: "YOUR RESET CODE",
        footerText: "If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.",
        bannerUrl: "https://res.cloudinary.com/weburea/image/upload/v1786379722/forgot_password_banner_image_ptlzfi.png"
      })
    },
    subscription: {
      name: "Subscription Activated",
      subject: "Your Recura subscription is active!",
      badge: "Billing & Payouts",
      description: "Triggers on payment gateway completion when a client activates a recurring payment tier.",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Subscription Activated</title>
</head>
<body style="margin:0;padding:40px;background-color:#08040e;font-family:'Segoe UI',sans-serif;color:#64748b;text-align:center;">
  <!-- Empty Preview State -->
</body>
</html>
      `.trim()
    }
  }

  const currentTemplate = emailTemplates[activeTemplate]

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentTemplate.html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Grid containing Sidebar Selector & Main Preview Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Template Selector Cards (Left Column) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Select Template</h4>
            <p className="text-xs text-slate-400">Review specific transactional flows:</p>
          </div>

          <div className="space-y-3">
            {(Object.keys(emailTemplates) as Array<keyof typeof emailTemplates>).map((key) => {
              const t = emailTemplates[key]
              const isActive = activeTemplate === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveTemplate(key)}
                  className={cn(
                    "w-full text-left p-5 rounded-2xl border transition-all cursor-pointer",
                    isActive 
                      ? "bg-[#6C5CE7] border-[#6C5CE7] text-white shadow-lg shadow-purple-900/10" 
                      : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-purple-300 dark:hover:border-purple-800/30"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full",
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-400"
                    )}>
                      {t.badge}
                    </span>
                    <Mail className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                  </div>
                  <h3 className="text-sm font-bold tracking-tight mb-1">{t.name}</h3>
                  <p className={cn(
                    "text-[11px] leading-relaxed",
                    isActive ? "text-purple-100" : "text-slate-400"
                  )}>
                    {t.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Live Preview Console (Right Column) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Viewport Resizer Toggle */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 self-start">
              <button
                onClick={() => setViewMode("desktop")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  viewMode === "desktop"
                    ? "bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                )}
              >
                <Monitor className="w-3.5 h-3.5" />
                Desktop
              </button>
              <button
                onClick={() => setViewMode("mobile")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  viewMode === "mobile"
                    ? "bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                )}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile
              </button>
            </div>

            {/* Code copier */}
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer shadow-xs transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  Copied HTML!
                </>
              ) : (
                <>
                  <Code className="w-3.5 h-3.5" />
                  Copy Template Code
                </>
              )}
            </button>
          </div>

          {/* Email Frame Simulated Container */}
          <div className="border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-black/20 shadow-inner flex flex-col min-h-[500px]">
            
            {/* Header simulating Gmail envelope */}
            <div className="bg-white dark:bg-[#1a152d] border-b border-slate-200 dark:border-white/5 px-6 py-4 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subject:</span>
                <span className="text-xs font-bold text-slate-800 dark:text-white truncate">{currentTemplate.subject}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sender:</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Recura &lt;webureaagency@gmail.com&gt;</span>
              </div>
            </div>

            {/* Centered preview block — height is driven by postMessage from inside srcDoc */}
            <div className="flex-1 flex justify-center p-6 sm:p-10">
              {activeTemplate === "subscription" ? (
                <div className="flex-1 flex items-center justify-center p-12 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-white/[0.02] min-h-[300px]">
                  <div className="text-center space-y-3">
                    <Mail className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto stroke-[1.5]" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Template Under Construction</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">
                        The Subscription Activated template design will be implemented in a future update.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className={cn(
                    "border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white shadow-2xl transition-all duration-500",
                    viewMode === "desktop" ? "w-[560px]" : "w-[340px]"
                  )}
                  style={{ height: `${iframeHeight}px` }}
                >
                  <iframe
                    key={`${activeTemplate}-${viewMode}`}
                    title="Email Live Preview"
                    srcDoc={injectHeightReporter(currentTemplate.html)}
                    scrolling="no"
                    style={{ border: 'none', margin: 0, width: '100%', height: '100%', display: 'block', overflow: 'hidden' }}
                    sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
                  />
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Cloudinary Asset Registry for references */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email System Assets</h4>
          <p className="text-xs text-slate-500">Curated Cloudinary URLs consumed by the mail templates:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h4 className="text-xs font-bold text-slate-800 dark:text-white">Email Header Banner</h4>
            </div>
            <p className="text-[11px] text-slate-400 break-all select-all font-mono p-2 bg-slate-100 dark:bg-white/5 rounded-lg mb-2">
              https://res.cloudinary.com/weburea/image/upload/v1786379732/email_banner_welcome_gdozxc.png
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01]">
            <div className="flex items-center gap-2 mb-2">
              <Link2 className="w-4 h-4 text-purple-500" />
              <h4 className="text-xs font-bold text-slate-800 dark:text-white">Email Footer Pattern</h4>
            </div>
            <p className="text-[11px] text-slate-400 break-all select-all font-mono p-2 bg-slate-100 dark:bg-white/5 rounded-lg mb-2">
              https://res.cloudinary.com/weburea/image/upload/v1785379537/images/Public/recura_brand_pattern_footer_clean.png
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
