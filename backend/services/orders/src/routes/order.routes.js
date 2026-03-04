import { Router } from "express";
import { confirmPayment, createOrder, getMyOrders, updateOrderStatus } from "../controller/order.controller.js";

const router = Router();

router.get("/my",getMyOrders)
router.post("/",createOrder);
router.post("/confirm-payment",confirmPayment);
router.post("/update-status",updateOrderStatus);

export default router;