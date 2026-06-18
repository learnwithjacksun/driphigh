import { Router } from "express";
import { questpayWebhook } from "../controllers/webhook.js";

const webhookRouter = Router();

webhookRouter.post("/questpay", questpayWebhook);

export default webhookRouter;
