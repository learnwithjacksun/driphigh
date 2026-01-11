import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,
    },
    lastName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
adminPassword: {
  type: String,
  required: false,
  default: null,
},
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },

    address: {
      type: Object,
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: false,
        default: "Nigeria",
      },
    },
    isNewUser: {
      type: Boolean,
      required: true,
      default: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    otp: {
      type: String,
      required: false,
    },
    otpExpiresAt: {
      type: Date,
      required: false,
    },
    secretKey: {
      type: String,
      required: false,
    },
    secretKeyExpiresAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.otp;
        delete ret.otpExpiresAt;
        delete ret.secretKey;
        delete ret.secretKeyExpiresAt;
        return ret;
      },
    },
  }
);

const UserModel = model("User", userSchema);

export default UserModel;
