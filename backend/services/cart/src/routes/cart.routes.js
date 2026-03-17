import express from "express";
import { addToCart, clearCart, getCart, removeFromCart } from "../controller/cart.controller.js";

const router = express.Router();

router.post("/", addToCart);
router.get("/",getCart);
router.delete("/clear",clearCart)
router.delete("/:productId",removeFromCart);

export default router;