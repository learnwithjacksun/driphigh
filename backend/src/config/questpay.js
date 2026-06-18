import axios from "axios";
import process from "process";

const questpay = axios.create({
  baseURL: process.env.QUESTPAY_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.QUESTPAY_API_KEY}`,
  },
  withCredentials: true, // Enable cookies/credentials
});


export default questpay;