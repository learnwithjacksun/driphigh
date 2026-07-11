import OrderModel from "../model/orders.js";
import UserModel from "../model/user.js";
import questpay from "../config/questpay.js";
import envFile from "../config/env.js";
import { onError } from "../utils/onError.js";
import sendEmail from "../config/email.js";
import { orderConfirmationEmail } from "../template/orderConfirmationEmail.js";
import { orderNotificationEmail } from "../template/orderNotificationEmail.js";
import { completeOrderPayment } from "../services/order.service.js";
import mongoose from "mongoose";

// Valid order statuses
const VALID_ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

// Create order (for user)
export const createOrder = async (req, res) => {
  const userId = req.user?.id;
  const {
    name,
    deliveryNote,
    price,
    images,
    category,
    sizes,
    colors,
    totalPrice,
    deliveryAddress,
    paymentMethod = "questpay",
    paymentStatus,
  } = req.body;

  try {
    // Validate required fields
    if (
      !name ||
      !price ||
      !images ||
      !Array.isArray(images) ||
      images.length === 0 ||
      !category ||
      !totalPrice ||
      !deliveryAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate delivery address
    if (
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.state
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete delivery address is required",
      });
    }

    // Validate payment method
    if (!["questpay", "delivery"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method. Must be 'questpay' or 'delivery'",
      });
    }

    // Validate payment status if provided
    if (paymentStatus && !["pending", "completed", "failed"].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status. Must be 'pending', 'completed', or 'failed'",
      });
    }

    const finalPaymentStatus = paymentStatus || "pending";

    // Get user to verify they exist
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const reference = `ORDER-${userId}-${Date.now()}`;

    // Create order
    const order = await OrderModel.create({
      user: userId,
      name,
      deliveryNote: deliveryNote || "",
      price,
      images,
      category,
      sizes: sizes || "",
      colors: colors || "",
      totalPrice,
      status: "pending",
      deliveryAddress: {
        street: deliveryAddress.street,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
      },
      paymentMethod,
      paymentStatus: finalPaymentStatus,
      reference,
    });

    if (paymentMethod === "questpay") {
      if (!envFile.QUESTPAY_API_KEY) {
        await OrderModel.findByIdAndDelete(order.id);
        return res.status(500).json({
          success: false,
          message: "Payment provider is not configured",
        });
      }

      try {
        const frontendUrl = (envFile.FRONTEND_URL || "https://www.driphigh.com").replace(
          /\/$/,
          ""
        );

        const paymentResponse = await questpay.post("/v1/checkout/initialize", {
          reference,
          email: user.email,
          amount: totalPrice,
          description: `Order payment - ${name}`,
          metadata: {
            userId: userId.toString(),
            orderId: order.id.toString(),
          },
          return_url: `${frontendUrl}/orders?ref=${encodeURIComponent(reference)}`,
        });

        if (!paymentResponse.data?.success) {
          await OrderModel.findByIdAndDelete(order.id);
          return res.status(400).json({
            success: false,
            message:
              paymentResponse.data?.message || "Failed to initialize payment",
          });
        }

        const checkout_url = paymentResponse.data?.data?.checkout_url;

        if (!checkout_url) {
          await OrderModel.findByIdAndDelete(order.id);
          return res.status(502).json({
            success: false,
            message: "Payment provider did not return a checkout URL",
          });
        }

        return res.status(201).json({
          success: true,
          message: "Order created. Complete payment to confirm.",
          order,
          checkout_url,
        });
      } catch (paymentError) {
        await OrderModel.findByIdAndDelete(order.id);
        const providerMessage =
          paymentError?.response?.data?.message || paymentError?.message;
        return res.status(502).json({
          success: false,
          message: providerMessage || "Failed to initialize payment",
        });
      }
    }

    // Populate user for email (delivery orders only — questpay emails sent after webhook)
    const orderWithUser = await OrderModel.findById(order.id).populate(
      "user",
    );

    // Send order confirmation email to user
    try {
      const username = user.firstName || user.email.split("@")[0];
      await sendEmail(
        "Order Confirmation - Driphigh",
        orderConfirmationEmail({
          username: username,
          email: user.email,
          order: orderWithUser,
        }),
        user.email,
        username
      );
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError);
    }

    // Send order notification email to admin
    try {
      const adminEmails = ["info@driphigh.com", "chinazanwafor969@gmail.com"];
      const adminNames = ["Admin", "Chinaza Nwafor"];
      for (let i = 0; i < adminEmails.length; i++) {
        await sendEmail(
          "New Order Notification - Driphigh",
          orderNotificationEmail({ order: orderWithUser, user: user }),
          adminEmails[i],
          adminNames[i]
        );
      }
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Get user orders (for user)
export const getUserOrders = async (req, res) => {
  const userId = req.user?.id;
  const { status, paymentStatus } = req.query;

  try {
    const query = { user: userId };

    // Filter by status if provided
    if (status && VALID_ORDER_STATUSES.includes(status)) {
      query.status = status;
    }

    // Filter by payment status if provided
    if (
      paymentStatus &&
      ["pending", "completed", "failed"].includes(paymentStatus)
    ) {
      query.paymentStatus = paymentStatus;
    }

    const orders = await OrderModel.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName email phone");

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
      count: orders.length,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Get single order by ID (for user - can only access their own orders)
export const getOrderById = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      });
    }

    const order = await OrderModel.findById(id).populate(
      "user",
      "firstName lastName email phone"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order (unless admin)
    // Handle both populated user object and ObjectId
    const orderUserId = order.user?.id 
      ? order.user.id.toString() 
      : (order.user?._id ? order.user._id.toString() : order.user.toString());
    const currentUserId = userId?.toString() || req.user._id?.toString();
    
    if (orderUserId !== currentUserId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to access this order",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  const { status, paymentStatus, userId } = req.query;

  try {
    const query = {};

    // Filter by user if provided
    if (userId) {
      query.user = userId;
    }

    // Filter by status if provided
    if (status && VALID_ORDER_STATUSES.includes(status)) {
      query.status = status;
    }

    // Filter by payment status if provided
    if (
      paymentStatus &&
      ["pending", "completed", "failed"].includes(paymentStatus)
    ) {
      query.paymentStatus = paymentStatus;
    }

    const orders = await OrderModel.find(query)
      .populate("user", "firstName lastName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
      count: orders.length,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      });
    }

    if (!status || !VALID_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Valid status is required. Must be one of: ${VALID_ORDER_STATUSES.join(", ")}`,
      });
    }

    const order = await OrderModel.findById(id).populate(
      "user",
      "firstName lastName email phone"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const oldStatus = order.status;
    order.status = status;

    // If order is delivered, mark payment as completed if it was pending
    if (status === "delivered" && order.paymentStatus === "pending") {
      order.paymentStatus = "completed";
    }

    // If order is cancelled, mark payment as failed if it was pending
    if (status === "cancelled" && order.paymentStatus === "pending") {
      order.paymentStatus = "failed";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
      previousStatus: oldStatus,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Confirm / sync payment after QuestPay return (user-facing fallback to webhook)
export const confirmPayment = async (req, res) => {
  const userId = req.user?.id;
  const reference = req.body?.reference || req.query?.reference;

  try {
    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required",
      });
    }

    const order = await OrderModel.findOne({ reference, user: userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found for this payment reference",
      });
    }

    if (order.paymentStatus === "completed") {
      return res.status(200).json({
        success: true,
        message: "Payment already confirmed",
        order,
      });
    }

    // Ask QuestPay for checkout status (try common endpoints)
    let providerStatus = null;
    let providerData = null;

    const statusCandidates = [
      () => questpay.get(`/v1/checkout/${encodeURIComponent(reference)}`),
      () => questpay.get(`/v1/checkout/status/${encodeURIComponent(reference)}`),
      () =>
        questpay.post("/v1/checkout/verify", {
          reference,
        }),
    ];

    for (const request of statusCandidates) {
      try {
        const response = await request();
        if (response?.data) {
          providerData = response.data?.data || response.data;
          providerStatus = String(
            providerData?.status ||
              providerData?.payment?.providerStatus ||
              providerData?.checkout?.status ||
              ""
          ).toLowerCase();
          if (providerStatus) break;
        }
      } catch {
        // try next candidate
      }
    }

    const paid = ["success", "successful", "completed", "paid"].includes(
      providerStatus
    );

    if (paid) {
      const updated = await completeOrderPayment(order);
      return res.status(200).json({
        success: true,
        message: "Payment confirmed successfully",
        order: updated,
      });
    }

    // Webhook may still be in flight — return current state without failing
    return res.status(200).json({
      success: true,
      message: "Payment is still pending confirmation",
      order,
      providerStatus: providerStatus || "unknown",
    });
  } catch (error) {
    onError(res, error);
  }
};

// Update payment status (admin only)
export const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      });
    }

    if (
      !paymentStatus ||
      !["pending", "completed", "failed"].includes(paymentStatus)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid payment status is required. Must be one of: pending, completed, failed",
      });
    }

    const order = await OrderModel.findById(id).populate(
      "user",
      "firstName lastName email phone"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const oldPaymentStatus = order.paymentStatus;
    order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      order,
      previousPaymentStatus: oldPaymentStatus,
    });
  } catch (error) {
    onError(res, error);
  }
};

