import { Router } from "express";
import {
  checkAuth,
  login,
  logout,
  adminLogin,
  verifyOtp,
  resendOtp,
  changePassword,
  forgotPassword,
  resetPassword,
  authenticateUser,
  completeKyc,
  adminCreation,
} from "../controllers/auth.js";
import authMiddleware from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/authenticate", authenticateUser);
authRouter.post("/logout", logout);
authRouter.post("/admin/login", adminLogin);
authRouter.post("/admin/create", adminCreation);
authRouter.get("/check", authMiddleware, checkAuth);
authRouter.post("/verify-otp", authMiddleware, verifyOtp);
authRouter.post("/resend-otp", authMiddleware, resendOtp);
authRouter.post("/kyc", authMiddleware, completeKyc);
authRouter.post("/change-password", authMiddleware, changePassword);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

export default authRouter;