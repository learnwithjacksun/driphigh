import { Router } from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/orders.js";
import authMiddleware from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";

const ordersRouter = Router();

// User routes - require authentication
ordersRouter.post("/", authMiddleware, createOrder);
ordersRouter.get("/my-orders", authMiddleware, getUserOrders);

// Admin routes - require authentication and admin role
// IMPORTANT: GET /all must come before GET /:id to avoid route conflicts
ordersRouter.get("/all", authMiddleware, isAdmin, getAllOrders);

// User and admin routes - parameterized routes must come after specific routes
ordersRouter.get("/:id", authMiddleware, getOrderById);
ordersRouter.patch("/:id/status", authMiddleware, isAdmin, updateOrderStatus);
ordersRouter.patch(
  "/:id/payment-status",
  authMiddleware,
  isAdmin,
  updatePaymentStatus
);

export default ordersRouter;

