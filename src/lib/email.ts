import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your email
    pass: process.env.SMTP_PASS, // Your email password or app password
  },
});

interface BanEmailParams {
  to: string;
  studentName: string;
  isBanned: boolean;
}

export async function sendBanNotificationEmail({
  to,
  studentName,
  isBanned,
}: BanEmailParams) {
  try {
    const subject = isBanned
      ? '⛔ Your Campus Connect Account Has Been Suspended'
      : '✅ Your Campus Connect Account Has Been Reactivated';

    const htmlContent = isBanned
      ? getBannedEmailTemplate(studentName)
      : getUnbannedEmailTemplate(studentName);

    const textContent = isBanned
      ? `Dear ${studentName},\n\nYour Campus Connect account has been suspended due to violation of our community guidelines.\n\nIf you believe this is a mistake, please contact support.\n\nBest regards,\nCampus Connect Admin Team`
      : `Dear ${studentName},\n\nGood news! Your Campus Connect account has been reactivated.\n\nYou can now access all features again.\n\nBest regards,\nCampus Connect Admin Team`;

    const info = await transporter.sendMail({
      from: `"Campus Connect Admin" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
}

function getBannedEmailTemplate(studentName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Suspended</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">⛔ Account Suspended</h1>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                    Dear <strong>${studentName}</strong>,
                  </p>
                  
                  <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                    We regret to inform you that your <strong>Campus Connect</strong> account has been suspended by our administration team.
                  </p>
                  
                  <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                      <strong>Reason:</strong> Your account activity violated our community guidelines or terms of service.
                    </p>
                  </div>
                  
                  <p style="margin: 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                    <strong>What this means:</strong>
                  </p>
                  
                  <ul style="margin: 0 0 20px; padding-left: 20px; color: #374151; font-size: 15px; line-height: 1.8;">
                    <li>You cannot access your Campus Connect account</li>
                    <li>Your profile is temporarily hidden</li>
                    <li>You cannot participate in campus activities</li>
                  </ul>
                  
                  <p style="margin: 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                    If you believe this action was taken in error or would like to appeal this decision, please contact our support team immediately.
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@campusconnect.com'}" 
                       style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      Contact Support
                    </a>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                    Campus Connect Admin Team
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    This is an automated message. Please do not reply directly to this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function getUnbannedEmailTemplate(studentName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Reactivated</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">✅ Welcome Back!</h1>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                    Dear <strong>${studentName}</strong>,
                  </p>
                  
                  <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                    Great news! Your <strong>Campus Connect</strong> account has been reactivated. 🎉
                  </p>
                  
                  <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #065f46; font-size: 14px; line-height: 1.6;">
                      <strong>Your account is now fully active!</strong> You can access all Campus Connect features again.
                    </p>
                  </div>
                  
                  <p style="margin: 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                    <strong>What you can do now:</strong>
                  </p>
                  
                  <ul style="margin: 0 0 20px; padding-left: 20px; color: #374151; font-size: 15px; line-height: 1.8;">
                    <li>Access your profile and dashboard</li>
                    <li>Connect with other students</li>
                    <li>Participate in campus events and activities</li>
                    <li>Use all platform features</li>
                  </ul>
                  
                  <p style="margin: 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                    Please remember to follow our community guidelines to maintain a positive environment for everyone.
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://campusconnect.com'}" 
                       style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      Go to Campus Connect
                    </a>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                    Campus Connect Admin Team
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    This is an automated message. Please do not reply directly to this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}