import process from "process";
import generateRandomNumber from "../utils/generateRandomNumbers.js";
import { onError } from "../utils/onError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import envFile from "../config/env.js";
import UserModel from "../model/user.js";
import sendEmail from "../config/email.js";
import { welcomeEmail } from "../template/welcomeEmail.js";
import { loginNotificationEmail } from "../template/loginNotificationEmail.js";

export const authenticateUser = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await UserModel.findOne({ email });

    // If user exists and is not new, login them directly
    if (user && !user.isNewUser) {
      // Check if email is verified
      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          message: "Please verify your email address before logging in",
          requiresVerification: true,
        });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, envFile.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Set cookie with token
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Send login notification email
      try {
        const username = user.firstName || user.email.split("@")[0];
        const ipAddress =
          req.ip ||
          req.headers["x-forwarded-for"] ||
          req.connection.remoteAddress;
        const userAgent = req.headers["user-agent"] || "Unknown device";

        await sendEmail(
          "New Login Detected - Driphigh",
          loginNotificationEmail({
            username: username,
            email: user.email,
            loginTime: new Date(),
            ipAddress: ipAddress,
            userAgent: userAgent,
          }),
          user.email,
          username
        );
      } catch (emailError) {
        console.error("Failed to send login notification email:", emailError);
        // Don't fail the request if email fails
      }

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user,
      });
    }

    // If user exists and is new, or user doesn't exist, send OTP
    const otp = generateRandomNumber(6);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (user) {
      // Existing new user - update OTP
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();
    } else {
      // New user - create user with temporary unique values (will be updated during KYC)
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const newUser = await UserModel.create({
        email,
        otp,
        otpExpiresAt,
        isVerified: false,
        isNewUser: true,
        firstName: `temp_${timestamp}_${randomSuffix}`,
        lastName: `temp_${timestamp}_${randomSuffix}`,
        phone: `temp_${timestamp}_${randomSuffix}`,
        address: {
          street: "temp",
          city: "temp",
          state: "temp",
          country: "Nigeria",
        },
      });

      // Generate JWT token for new user
      const token = jwt.sign({ id: newUser.id }, envFile.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Set cookie with token
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Send email with OTP
      const username = newUser.firstName || newUser.email.split("@")[0];
      await sendEmail(
        "Welcome to Driphigh - Verify Your Email",
        welcomeEmail({
          email: newUser.email,
          otp: otp,
        }),
        newUser.email,
        username
      );

      return res.status(201).json({
        success: true,
        message: "Please check your email for verification code.",
        user: newUser,
      });
    }

    // Send email with OTP for existing new user
    const username = user.firstName || user.email.split("@")[0];
    await sendEmail(
      "Driphigh - Verification Code",
      welcomeEmail({
        username: username,
        email: user.email,
        otp: otp,
      }),
      user.email,
      username
    );

    // Generate JWT token (user can use this to verify OTP)
    const token = jwt.sign({ id: user.id }, envFile.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Please check your email for verification code.",
      user,
    });
  } catch (error) {
    onError(res, error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address before logging in",
        requiresVerification: true,
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, envFile.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send login notification email
    try {
      const username = user.firstName || user.email.split("@")[0];
      const ipAddress =
        req.ip ||
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress;
      const userAgent = req.headers["user-agent"] || "Unknown device";

      await sendEmail(
        "New Login Detected - Driphigh",
        loginNotificationEmail({
          username: username,
          email: user.email,
          loginTime: new Date(),
          ipAddress: ipAddress,
          userAgent: userAgent,
        }),
        user.email,
        username
      );
    } catch (emailError) {
      console.error("Failed to send login notification email:", emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    onError(res, error);
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    res.status(200).json({
      success: true,
      message: "User authenticated",
      user,
    });
  } catch (error) {
    onError(res, error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (!user.isAdmin) {
      return res.status(401).json({
        message: "Unauthorized, you are not an admin",
        success: false,
      });
    }
    const isPasswordCorrect = bcrypt.compareSync(password, user.adminPassword);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, envFile.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      user,
    });
  } catch (error) {
    onError(res, error);
  }
};

export const adminCreation = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const existingAdmin = await UserModel.findOne({ email });
    if (existingAdmin && existingAdmin.isAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newAdmin = await UserModel.create({
      firstName: `Admin`,
      lastName: `Admin`,
      phone: `0000000000`,
      address: {
        street: "Admin",
        city: "Admin",
        state: "Admin",
        country: "Nigeria",
      },
      email,
      adminPassword: passwordHash,
      isAdmin: true,
      isVerified: true,
      isNewUser: false,
    });
    const token = jwt.sign({ id: newAdmin.id }, envFile.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      user: newAdmin,
    });
  } catch (error) {
    onError(res, error);
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      currentPassword,
      user.adminPassword
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.adminPassword = passwordHash;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    onError(res, error);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      // Don't reveal if email exists for security
      return res.status(200).json({
        success: true,
        message: "If email exists, a password reset link will be sent",
      });
    }

    // Generate reset token (in production, use a more secure token)
    const resetToken = jwt.sign({ id: user.id }, envFile.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.secretKey = resetToken;
    user.secretKeyExpiresAt = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // In production, send email with reset link
    // For now, just return success (you can integrate with email service)
    res.status(200).json({
      success: true,
      message: "If email exists, a password reset link will be sent",
      // In development, you might want to return the token for testing
      // resetToken: resetToken, // Remove in production
    });
  } catch (error) {
    onError(res, error);
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, envFile.JWT_SECRET);
    } catch (error) {
      onError(res, error);
    }

    const user = await UserModel.findById(decoded.id);
    if (!user || user.secretKey !== token) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (user.secretKeyExpiresAt && new Date() > user.secretKeyExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "Token has expired",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.adminPassword = passwordHash;
    user.secretKey = undefined;
    user.secretKeyExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    onError(res, error);
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user?.id;

  try {
    if (!otp || otp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: "Valid 6-digit OTP is required",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify the user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user,
      isNewUser: user.isNewUser,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Resend OTP
export const resendOtp = async (req, res) => {
  const userId = req.user?.id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new 6-digit OTP
    const otp = generateRandomNumber(6);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send email with new OTP
    try {
      const username = user.firstName || user.email.split("@")[0];
      await sendEmail(
        "Protection Pool - New Verification Code",
        welcomeEmail({
          username: username,
          email: user.email,
          otp: otp,
        }),
        user.email,
        username
      );
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    onError(res, error);
  }
};

// Complete KYC (Know Your Customer)
export const completeKyc = async (req, res) => {
  const { firstName, lastName, phone, address } = req.body;
  const userId = req.user?.id;

  try {
    if (!firstName || !lastName || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.country
    ) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address first",
      });
    }

    // Update user profile
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.address = {
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country || "Nigeria",
    };
    user.isNewUser = false; // Mark user as no longer new
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      user,
    });
  } catch (error) {
    onError(res, error);
  }
};
