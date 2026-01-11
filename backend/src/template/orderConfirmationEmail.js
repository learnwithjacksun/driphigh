export const orderConfirmationEmail = (orderData) => {
  const { username, order } = orderData;
  const { id, name, price, totalPrice, images, category, sizes, colors, deliveryAddress, paymentMethod, paymentStatus, deliveryNote, status, createdAt } = order;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
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
    <title>Order Confirmation - Driphigh</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; line-height: 1.6;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border: 1px solid #000000;">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #000000; padding: 40px 30px; text-align: center;">
                            <img src="https://www.driphigh.com/logo.jpeg" alt="Driphigh Logo" style="max-width: 150px; height: auto; margin-bottom: 20px;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                                Driphigh
                            </h1>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px; color: #000000; font-size: 24px; font-weight: 600;">
                                Order Confirmed!
                            </h2>
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px;">
                                Hi ${username},
                            </p>
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px;">
                                Thank you for your order! We've received your order and will begin processing it shortly.
                            </p>

                            <!-- Order Details Box -->
                            <div style="background-color: #000000; border-radius: 8px; padding: 30px; margin: 30px 0;">
                                <h3 style="margin: 0 0 20px; color: #ffffff; font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                    Order Details
                                </h3>
                                
                                <table role="presentation" style="width: 100%; border-collapse: collapse; color: #ffffff;">
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 14px; opacity: 0.8;">Order ID:</td>
                                        <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right;">#${id.slice(-8).toUpperCase()}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 14px; opacity: 0.8;">Order Date:</td>
                                        <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right;">${formattedDate}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 14px; opacity: 0.8;">Status:</td>
                                        <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right; text-transform: capitalize;">${status}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 14px; opacity: 0.8;">Payment Method:</td>
                                        <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right; text-transform: capitalize;">${paymentMethod}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 14px; opacity: 0.8;">Payment Status:</td>
                                        <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right; text-transform: capitalize;">${paymentStatus}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Product Details -->
                            <div style="border: 1px solid #000000; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="margin: 0 0 15px; color: #000000; font-size: 18px; font-weight: 600;">
                                    Item Ordered
                                </h3>
                                ${images && images.length > 0 ? `
                                <img src="${images[0]}" alt="${name}" style="max-width: 100%; height: auto; border-radius: 4px; margin-bottom: 15px; border: 1px solid #000000;">
                                ` : ''}
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 6px 0; color: #666666; font-size: 14px; width: 40%;">Product:</td>
                                        <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 600;">${name}</td>
                                    </tr>
                                    ${category ? `
                                    <tr>
                                        <td style="padding: 6px 0; color: #666666; font-size: 14px;">Category:</td>
                                        <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 600; text-transform: capitalize;">${category}</td>
                                    </tr>
                                    ` : ''}
                                    ${sizes ? `
                                    <tr>
                                        <td style="padding: 6px 0; color: #666666; font-size: 14px;">Size:</td>
                                        <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 600;">${sizes}</td>
                                    </tr>
                                    ` : ''}
                                    ${colors ? `
                                    <tr>
                                        <td style="padding: 6px 0; color: #666666; font-size: 14px;">Color:</td>
                                        <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 600;">${colors}</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 6px 0; color: #666666; font-size: 14px;">Price:</td>
                                        <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 600;">₦${price.toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; color: #666666; font-size: 14px;">Total:</td>
                                        <td style="padding: 6px 0; color: #000000; font-size: 16px; font-weight: 700;">₦${totalPrice.toLocaleString()}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Delivery Address -->
                            ${deliveryAddress ? `
                            <div style="border: 1px solid #000000; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="margin: 0 0 15px; color: #000000; font-size: 18px; font-weight: 600;">
                                    Delivery Address
                                </h3>
                                <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.8;">
                                    ${deliveryAddress.street}<br>
                                    ${deliveryAddress.city}, ${deliveryAddress.state}
                                </p>
                            </div>
                            ` : ''}

                            <!-- Delivery Note -->
                            ${deliveryNote ? `
                            <div style="background-color: #f5f5f5; border-left: 4px solid #000000; padding: 15px; margin: 25px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #333333; font-size: 14px;">
                                    <strong>Delivery Note:</strong> ${deliveryNote}
                                </p>
                            </div>
                            ` : ''}

                            <!-- Next Steps -->
                            <div style="background-color: #f5f5f5; border: 1px solid #000000; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="margin: 0 0 15px; color: #000000; font-size: 16px; font-weight: 600;">
                                    What's Next?
                                </h3>
                                <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 14px; line-height: 1.8;">
                                    <li>We'll send you an email when your order ships</li>
                                    <li>You can track your order status in your account</li>
                                    <li>Expected delivery time: 3-5 business days</li>
                                </ul>
                            </div>

                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="https://www.driphigh.com/orders" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: 600; font-size: 16px; border: 2px solid #000000;">
                                            View Order Details
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #000000; padding: 30px; text-align: center;">
                            <p style="margin: 0 0 10px; color: #ffffff; font-size: 14px;">
                                Questions about your order?
                            </p>
                            <p style="margin: 0 0 10px; color: #ffffff; font-size: 14px;">
                                <a href="mailto:support@driphigh.com" style="color: #ffffff; text-decoration: underline; font-weight: 600;">
                                    support@driphigh.com
                                </a>
                            </p>
                            <p style="margin: 15px 0 0; color: #ffffff; font-size: 12px; opacity: 0.8; line-height: 1.6;">
                                Visit us at: <a href="https://www.driphigh.com" style="color: #ffffff; text-decoration: underline;">www.driphigh.com</a><br>
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

