import { Router } from "express";
import { createShipment, trackShipment, updateShipmentStatus } from "../controller/shipping.controller.js";

const router = Router();

router.post("/",createShipment);
router.post("/update-status",updateShipmentStatus);
router.get("/track/:trackingNumber",trackShipment)

export default router;