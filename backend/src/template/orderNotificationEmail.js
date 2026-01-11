export const orderNotificationEmail = (orderData) => {
  const { order, user } = orderData;
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
    <title>New Order Notification - Driphigh</title>
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
                                Driphigh Admin
                            </h1>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px; color: #000000; font-size: 24px; font-weight: 600;">
                                New Order Received
                            </h2>
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px;">
                                A new order has been placed on Driphigh. Please review and process the order.
                            </p>

                            <!-- Alert Box -->
                            <div style="background-color: #000000; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                                <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">
                                    Order ID: #${id.slice(-8).toUpperCase()}
                                </p>
                                <p style="margin: 10px 0 0; color: #ffffff; font-size: 14px; opacity: 0.8;">
                                    ${formattedDate}
                                </p>
                            </div>

                            <!-- Customer Information -->
                            <div style="border: 1px solid #000000; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="margin: 0 0 15px; color: #000000; font-size: 18px; font-weight: 600;">
                                    Customer Information
                                </h3>
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 6px 0; color: #666666; font-size: 14px; width: 40%;">Name:</td>
                                        <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 600;">${user?.firstName || ''} ${user?.lastName || ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; color: #666666; font-size: 14px;">Email:</td>
                                        <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 600;">${user?.email || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; color: #666666; font-size: 14px;">Phone:</td>
                                        <td style="padding: 6px 0; color: #000000; font-size: 14px; font-weight: 600;">${user?.phone || 'N/A'}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Order Details -->
                            <div style="background-color: #000000; border-radius: 8px; padding: 30px; margin: 25px 0;">
                                <h3 style="margin: 0 0 20px; color: #ffffff; font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                    Order Details
                                </h3>
                                
                                <table role="presentation" style="width: 100%; border-collapse: collapse; color: #ffffff;">
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
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 14px; opacity: 0.8;">Total Amount:</td>
                                        <td style="padding: 8px 0; font-size: 18px; font-weight: 700; text-align: right;">₦${totalPrice.toLocaleString()}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Product Details -->
                            <div style="border: 1px solid #000000; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="margin: 0 0 15px; color: #000000; font-size: 18px; font-weight: 600;">
                                    Product Ordered
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

                            <!-- Action Required -->
                            <div style="background-color: #f5f5f5; border: 2px solid #000000; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="margin: 0 0 15px; color: #000000; font-size: 16px; font-weight: 600;">
                                    Action Required
                                </h3>
                                <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 14px; line-height: 1.8;">
                                    <li>Review the order details</li>
                                    <li>Update order status as you process it</li>
                                    <li>Ensure payment is confirmed before shipping</li>
                                </ul>
                            </div>

                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="https://admin.driphigh.com/orders" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: 600; font-size: 16px; border: 2px solid #000000;">
                                            View Order in Admin Dashboard
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
                                Driphigh Admin Portal
                            </p>
                            <p style="margin: 15px 0 0; color: #ffffff; font-size: 12px; opacity: 0.8; line-height: 1.6;">
                                This is an automated notification from Driphigh.<br>
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

