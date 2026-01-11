export const welcomeEmail = (userData) => {
  const { email, otp } = userData;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Driphigh</title>
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
                            <p style="margin: 10px 0 0; color: #ffffff; font-size: 14px; letter-spacing: 1px;">
                                Premium Streetwear
                            </p>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px; color: #000000; font-size: 24px; font-weight: 600;">
                                Welcome to Driphigh!
                            </h2>
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px;">
                                Thank you for joining Driphigh! Your account has been successfully created. To complete your registration and start shopping, please verify your email address using the code below.
                            </p>

                            <!-- OTP Verification Box -->
                            <div style="background-color: #000000; border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
                                <p style="margin: 0 0 15px; color: #ffffff; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                                    Your Verification Code
                                </p>
                                <div style="background-color: #ffffff; border: 2px solid #000000; border-radius: 8px; padding: 20px; margin: 15px 0;">
                                    <p style="margin: 0; color: #000000; font-size: 36px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 8px;">
                                        ${otp}
                                    </p>
                                </div>
                                <p style="margin: 15px 0 0; color: #ffffff; font-size: 12px; opacity: 0.8;">
                                    This code will expire in 10 minutes
                                </p>
                            </div>

                            <!-- Verification Instructions -->
                            <div style="background-color: #f5f5f5; border-left: 4px solid #000000; padding: 20px; margin: 25px 0; border-radius: 4px;">
                                <h3 style="margin: 0 0 12px; color: #000000; font-size: 16px; font-weight: 600;">
                                    📧 How to Verify Your Email
                                </h3>
                                <ol style="margin: 0; padding-left: 20px; color: #333333; font-size: 14px; line-height: 1.8;">
                                    <li style="margin-bottom: 8px;">Go to the verification page on Driphigh</li>
                                    <li style="margin-bottom: 8px;">Enter the 6-digit code shown above: <strong style="font-family: 'Courier New', monospace; background-color: #000000; color: #ffffff; padding: 2px 6px; border-radius: 3px;">${otp}</strong></li>
                                    <li style="margin-bottom: 8px;">Click "Verify Email" to complete your registration</li>
                                    <li>Start shopping for premium streetwear!</li>
                                </ol>
                            </div>

                            <!-- Security Reminder -->
                            <div style="background-color: #f5f5f5; border-left: 4px solid #000000; padding: 15px; margin: 25px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #333333; font-size: 14px;">
                                    <strong>🔒 Security Reminder:</strong> Never share your verification code with anyone. Driphigh will never ask you for your code via phone or email. If you didn't request this code, please ignore this email.
                                </p>
                            </div>

                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="https://driphigh.vercel.app/auth/verify-otp" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: 600; font-size: 16px; border: 2px solid #000000;">
                                            Verify Your Email
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Account Details -->
                            <div style="background-color: #f5f5f5; border: 1px solid #000000; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="margin: 0 0 15px; color: #000000; font-size: 16px; font-weight: 600;">
                                    Your Account Information
                                </h3>
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 6px 0; color: #666666; font-size: 14px; width: 40%;">Email:</td>
                                        <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 600;">${email}</td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #000000; padding: 30px; text-align: center;">
                            <p style="margin: 0 0 10px; color: #ffffff; font-size: 14px;">
                                Need help? Contact our support team:
                            </p>
                            <p style="margin: 0 0 10px; color: #ffffff; font-size: 14px;">
                                <a href="mailto:support@driphigh.com" style="color: #ffffff; text-decoration: underline; font-weight: 600;">
                                    support@driphigh.com
                                </a>
                            </p>
                            <p style="margin: 15px 0 0; color: #ffffff; font-size: 12px; opacity: 0.8; line-height: 1.6;">
                                Visit us at: <a href="https://driphigh.vercel.app" style="color: #ffffff; text-decoration: underline;">driphigh.vercel.app</a><br>
                                This is an automated email from Driphigh. Please do not reply to this email.<br>
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
