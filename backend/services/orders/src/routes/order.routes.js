import { Router } from "express";
import { createOrder } from "../controller/order.controller.js";

const router = Router();

router.post("/",createOrder);

export default router;