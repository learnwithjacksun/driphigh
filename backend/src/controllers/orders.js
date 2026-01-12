import OrderModel from "../model/orders.js";
import UserModel from "../model/user.js";
import { onError } from "../utils/onError.js";
import sendEmail from "../config/email.js";
import { orderConfirmationEmail } from "../template/orderConfirmationEmail.js";
import { orderNotificationEmail } from "../template/orderNotificationEmail.js";
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
    paymentMethod = "paystack",
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
    if (!["paystack", "delivery"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method. Must be 'paystack' or 'delivery'",
      });
    }

    // Validate payment status if provided
    if (paymentStatus && !["pending", "completed", "failed"].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status. Must be 'pending', 'completed', or 'failed'",
      });
    }

    // Determine payment status based on payment method if not provided
    let finalPaymentStatus = paymentStatus;
    if (!finalPaymentStatus) {
      // If payment method is paystack and paymentStatus is not provided, default to pending
      // (This should only happen if paymentStatus is explicitly set to "completed" from frontend after successful payment)
      finalPaymentStatus = paymentMethod === "delivery" ? "pending" : "pending";
    }

    // Get user to verify they exist
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

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
    });

    // Populate user for email
    const orderWithUser = await OrderModel.findById(order.id).populate(
      "user",
      "firstName lastName email phone"
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
      // Don't fail the request if email fails
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
      // Don't fail the request if email fails
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

