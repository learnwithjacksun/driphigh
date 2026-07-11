import OrderModel from "../model/orders.js";
import sendEmail from "../config/email.js";
import { orderConfirmationEmail } from "../template/orderConfirmationEmail.js";
import { orderNotificationEmail } from "../template/orderNotificationEmail.js";

export const createOrder = async (orderData) => {
  const order = await OrderModel.create(orderData);
  return order;
};

/**
 * Mark an order as paid and send confirmation emails (idempotent).
 */
export const completeOrderPayment = async (order) => {
  if (!order) return null;
  if (order.paymentStatus === "completed") {
    return order;
  }

  order.paymentStatus = "completed";
  if (order.status === "pending") {
    order.status = "processing";
  }
  await order.save();

  const orderWithUser = await OrderModel.findById(order._id).populate("user");
  const user = orderWithUser?.user;

  if (user?.email) {
    try {
      const username = user.firstName || user.email.split("@")[0];
      await sendEmail(
        "Order Confirmation - Driphigh",
        orderConfirmationEmail({
          username,
          email: user.email,
          order: orderWithUser,
        }),
        user.email,
        username
      );
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError);
    }

    try {
      const adminEmails = ["info@driphigh.com", "chinazanwafor969@gmail.com"];
      const adminNames = ["Admin", "Chinaza Nwafor"];
      for (let i = 0; i < adminEmails.length; i++) {
        await sendEmail(
          "New Order Notification - Driphigh",
          orderNotificationEmail({ order: orderWithUser, user }),
          adminEmails[i],
          adminNames[i]
        );
      }
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
    }
  }

  return orderWithUser;
};

/**
 * Find order from QuestPay webhook/payment payload.
 */
export const findOrderFromPaymentData = async (data) => {
  if (!data) return null;

  const reference =
    data.reference || data.checkout?.reference || data.checkout_reference;

  if (reference) {
    const byRef = await OrderModel.findOne({ reference });
    if (byRef) return byRef;
  }

  const orderId = data.metadata?.orderId || data.metadata?.order_id;
  if (orderId) {
    const byId = await OrderModel.findById(orderId);
    if (byId) return byId;
  }

  return null;
};
