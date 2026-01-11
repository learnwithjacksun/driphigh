import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/products.js";
import authMiddleware from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";

const productsRouter = Router();

// Public routes
productsRouter.get("/", getAllProducts);
productsRouter.get("/:id", getProductById);

// Admin routes - require authentication and admin role
productsRouter.post("/", authMiddleware, isAdmin, createProduct);
productsRouter.patch("/:id", authMiddleware, isAdmin, updateProduct);
productsRouter.delete("/:id", authMiddleware, isAdmin, deleteProduct);

export default productsRouter;

