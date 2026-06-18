import crypto from "crypto";
import process from "process";
import OrderModel from "../model/orders.js";
import sendEmail from "../config/email.js";
import { orderConfirmationEmail } from "../template/orderConfirmationEmail.js";
import { orderNotificationEmail } from "../template/orderNotificationEmail.js";

export const questpayWebhook = async (req, res) => {
  const signature = req.headers["x-questpay-signature"];
  const payload = JSON.stringify(req.body);

  const calculatedSignature = crypto
    .createHmac("sha256", process.env.QUESTPAY_API_KEY)
    .update(payload)
    .digest("hex");

  if (calculatedSignature !== signature) {
    return res.status(400).send("Invalid signature");
  }

  const { event, data } = req.body;

  if (event === "payment.received" && data?.status === "success") {
    const order = await OrderModel.findOne({ reference: data.reference });

    if (order && order.paymentStatus !== "completed") {
      order.paymentStatus = "completed";
      await order.save();

      const orderWithUser = await OrderModel.findById(order.id).populate(
        "user",
      );
      const user = orderWithUser.user;

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
    }
  }

  res.status(200).send("OK");
};
