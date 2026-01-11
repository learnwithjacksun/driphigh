import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import envFile from "./config/env.js";
import authRouter from "./routes/auth.route.js";
import ordersRouter from "./routes/orders.route.js";
import productsRouter from "./routes/products.route.js";
import userRouter from "./routes/user.route.js";

const Port = envFile.PORT || 5000;

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "https://driphigh.com",
  "https://www.driphigh.com",
  "https://admin.driphigh.com",
];

app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedOrigins: allowedOrigins,
  })
);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
    status: "success",
  });
});

app.get("/ping", (req, res) => {
  res.send("ok");
});

app.use("/v1/auth", authRouter);
app.use("/v1/orders", ordersRouter);
app.use("/v1/products", productsRouter);
app.use("/v1/user", userRouter);

app.listen(Port, () => {
  console.log(`Server is running on port http://localhost:${Port}`);
});
