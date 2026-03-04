import { Router } from "express";
import { processPayment } from "../controller/payment.controller.js";

const router = Router();

router.post("/pay",processPayment);

export default router;