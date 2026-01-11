import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
} from "../controllers/user.js";
import authMiddleware from "../middleware/auth.middleware.js";

const userRouter = Router();



// All other routes require authentication
userRouter.use(authMiddleware);

// Get user profile
userRouter.get("/profile", getProfile);

// Update user profile
userRouter.put("/profile", updateProfile);


// Get all users (admin only)
userRouter.get("/users", getAllUsers);

// Get user by ID (admin only)
userRouter.get("/users/:id", getUserById);


export default userRouter;
