import { onError } from "../utils/onError.js";
import UserModel from "../model/user.js";

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    onError(res, error);
  }
};

export const updateProfile = async (req, res) => {
  const { firstName, lastName, email, phone, street, city, state } = req.body;

  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

  

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
      user.email = email;
      // Reset verification status if email changes
      user.isVerified = false;
    }

    // Check if phone is being changed and if it's already taken
    if (phone && phone !== user.phone) {
      const existingUser = await UserModel.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Phone number already in use",
        });
      }
      user.phone = phone;
    }

    if (street && street !== user.address.street) {
      user.address.street = street;
    }
    if (city && city !== user.address.city) {
      user.address.city = city;
    }
    if (state && state !== user.address.state) {
      user.address.state = state;
    }
    if (firstName && firstName !== user.firstName) {
      user.firstName = firstName;
    }
    if (lastName && lastName !== user.lastName) {
      user.lastName = lastName;
    }
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    onError(res, error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
      count: users.length,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Get user by ID (admin only)
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    onError(res, error);
  }
};

