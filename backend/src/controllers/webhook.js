import crypto from "crypto";
import { Buffer } from "buffer";
import envFile from "../config/env.js";
import {
  completeOrderPayment,
  findOrderFromPaymentData,
} from "../services/order.service.js";

const isPaymentSuccessful = (data) => {
  if (!data) return false;

  const status = String(
    data.status || data.payment?.providerStatus || ""
  ).toLowerCase();

  return ["success", "successful", "completed", "paid"].includes(status);
};

export const questpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-questpay-signature"];
    const secret = envFile.QUESTPAY_API_KEY;

    if (!secret) {
      console.error("QuestPay webhook: QUESTPAY_API_KEY is not configured");
      return res.status(500).send("Webhook not configured");
    }

    if (!signature) {
      console.error("QuestPay webhook: missing x-questpay-signature header");
      return res.status(400).send("Missing signature");
    }

    // Prefer raw body — re-stringifying parsed JSON often breaks HMAC verification
    const payload =
      typeof req.rawBody === "string"
        ? req.rawBody
        : Buffer.isBuffer(req.rawBody)
          ? req.rawBody.toString("utf8")
          : JSON.stringify(req.body);

    const calculatedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const provided = String(signature).replace(/^sha256=/i, "").trim();

    const valid =
      calculatedSignature.length === provided.length &&
      crypto.timingSafeEqual(
        Buffer.from(calculatedSignature),
        Buffer.from(provided)
      );

    if (!valid) {
      console.error("QuestPay webhook: invalid signature");
      return res.status(400).send("Invalid signature");
    }

    const { event, data } = req.body || {};
    console.log("QuestPay webhook received:", event, data?.reference);

    if (event === "payment.received" && isPaymentSuccessful(data)) {
      const order = await findOrderFromPaymentData(data);

      if (!order) {
        console.error(
          "QuestPay webhook: order not found for reference",
          data?.reference,
          "orderId",
          data?.metadata?.orderId
        );
      } else {
        await completeOrderPayment(order);
        console.log(
          "QuestPay webhook: order marked paid",
          order.reference || order._id
        );
      }
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("QuestPay webhook error:", error);
    // Still acknowledge so QuestPay does not retry endlessly on our bugs
    return res.status(200).send("OK");
  }
};
