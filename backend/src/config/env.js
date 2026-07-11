import process from "process";

const envFile = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    FRONTEND_URL: process.env.FRONTEND_URL || "https://www.driphigh.com",
    QUESTPAY_API_KEY: process.env.QUESTPAY_API_KEY,
    QUESTPAY_BASE_URL:
      process.env.QUESTPAY_BASE_URL ||
      "https://payments-server.questlabs.cc/api",
}

export default envFile;