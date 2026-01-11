export const loginNotificationEmail = (userData) => {
  const { username, email, loginTime, ipAddress, userAgent } = userData;

  const formattedDate = new Date(loginTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Notification - Driphigh</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; line-height: 1.6;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border: 1px solid #000000;">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #000000; padding: 40px 30px; text-align: center;">
                            <img src="https://driphigh.vercel.app/logo.jpeg" alt="Driphigh Logo" style="max-width: 150px; height: auto; margin-bottom: 20px;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                                Driphigh
                            </h1>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px; color: #000000; font-size: 24px; font-weight: 600;">
                                New Login Detected
                            </h2>
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px;">
                                Hi ${username},
                            </p>
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px;">
                                We detected a new login to your Driphigh account. If this was you, you can safely ignore this email.
                            </p>

                            <!-- Login Details Box -->
                            <div style="background-color: #000000; border-radius: 8px; padding: 30px; margin: 30px 0;">
                                <h3 style="margin: 0 0 20px; color: #ffffff; font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                    Login Details
                                </h3>
                                
                                <table role="presentation" style="width: 100%; border-collapse: collapse; color: #ffffff;">
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 14px; opacity: 0.8;">Time:</td>
                                        <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right;">${formattedDate}</td>
                                    </tr>
                                    ${ipAddress ? `
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 14px; opacity: 0.8;">IP Address:</td>
                                        <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right; font-family: 'Courier New', monospace;">${ipAddress}</td>
                                    </tr>
                                    ` : ''}
                                    ${userAgent ? `
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 14px; opacity: 0.8;">Device:</td>
                                        <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right;">${userAgent}</td>
                                    </tr>
                                    ` : ''}
                                </table>
                            </div>

                            <!-- Security Alert -->
                            <div style="background-color: #f5f5f5; border-left: 4px solid #000000; padding: 20px; margin: 25px 0; border-radius: 4px;">
                                <h3 style="margin: 0 0 12px; color: #000000; font-size: 16px; font-weight: 600;">
                                    🔒 Security Alert
                                </h3>
                                <p style="margin: 0 0 15px; color: #333333; font-size: 14px;">
                                    If you did not initiate this login, your account may be compromised. Please take immediate action to secure your account.
                                </p>
                                <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 14px; line-height: 1.8;">
                                    <li>Change your password immediately</li>
                                    <li>Review your account activity</li>
                                    <li>Contact support if you notice any suspicious activity</li>
                                </ul>
                            </div>

                            <!-- Action Buttons -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td align="center" style="padding-bottom: 10px;">
                                        <a href="https://driphigh.vercel.app/auth/change-password" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: 600; font-size: 16px; border: 2px solid #000000;">
                                            Change Password
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <a href="https://driphigh.vercel.app/account" style="display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: 600; font-size: 16px; border: 2px solid #000000;">
                                            View Account Activity
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Account Information -->
                            <div style="background-color: #f5f5f5; border: 1px solid #000000; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="margin: 0 0 15px; color: #000000; font-size: 16px; font-weight: 600;">
                                    Account Information
                                </h3>
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 6px 0; color: #666666; font-size: 14px; width: 40%;">Email:</td>
                                        <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 600;">${email}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Security Tips -->
                            <div style="background-color: #f5f5f5; border: 1px solid #000000; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="margin: 0 0 15px; color: #000000; font-size: 16px; font-weight: 600;">
                                    Security Tips
                                </h3>
                                <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 14px; line-height: 1.8;">
                                    <li>Use a strong, unique password</li>
                                    <li>Enable two-factor authentication if available</li>
                                    <li>Never share your login credentials</li>
                                    <li>Log out from shared or public devices</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #000000; padding: 30px; text-align: center;">
                            <p style="margin: 0 0 10px; color: #ffffff; font-size: 14px;">
                                Need help securing your account?
                            </p>
                            <p style="margin: 0 0 10px; color: #ffffff; font-size: 14px;">
                                <a href="mailto:support@driphigh.com" style="color: #ffffff; text-decoration: underline; font-weight: 600;">
                                    support@driphigh.com
                                </a>
                            </p>
                            <p style="margin: 15px 0 0; color: #ffffff; font-size: 12px; opacity: 0.8; line-height: 1.6;">
                                Visit us at: <a href="https://driphigh.vercel.app" style="color: #ffffff; text-decoration: underline;">driphigh.vercel.app</a><br>
                                This is an automated security notification from Driphigh.<br>
                                © ${new Date().getFullYear()} Driphigh. All rights reserved.
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
};

