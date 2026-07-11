import axios from "axios";
import envFile from "./env.js";

const questpay = axios.create({
  baseURL: envFile.QUESTPAY_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${envFile.QUESTPAY_API_KEY}`,
  },
});

export default questpay;
