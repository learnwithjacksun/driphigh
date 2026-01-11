import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    deliveryNote: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    sizes: {
      type: String,
      required: false,
    },
    colors: {
      type: String,
      required: false,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    deliveryAddress: {
      type: Object,
      required: true,
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
    },
    paymentMethod: {
      type: ["paystack", "delivery"],
      required: true,
      default: "paystack",
    },
    paymentStatus: {
      type: ["pending", "completed", "failed"],
      required: true,
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const OrderModel = model("Order", orderSchema);

export default OrderModel;
