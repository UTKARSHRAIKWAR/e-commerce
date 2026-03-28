import Shipping from "../db/shipping.model.js";
import asyncHandler from "express-async-handler"
import crypto from "crypto"
import axios from "axios"
import logger from "../utils/logger.js";

export const createShipment = asyncHandler(async (req,res)=>{
    const {orderId, userId, address} = req.body;

    const trackingNumber = crypto.randomBytes(8).toString("hex");

    const shipment = await Shipping.create({
        orderId,
        userId,
        address,
        trackingNumber
    });

    if(!shipment){
        logger.error("Shipment creation failed", { orderId, userId });
        res.status(500).json({
            message:"Failed to create shipment."
        })
    }

    logger.info("Shipment created successfully", {
        trackingNumber,
        orderId
    });
    

    res.status(201).json(shipment);
})


export const updateShipmentStatus = asyncHandler(async(req,res)=>{
    const {trackingNumber, status} = req.body;

    const shipment =await Shipping.findOne(
        {trackingNumber},
    );

    if(!shipment){
        logger.warn("Shipment not found", { trackingNumber });
        return res.status(404).json({message:"Shipment not found."});
    }

    shipment.status = status;
    await shipment.save();

    //notify order service
    try {
        await axios.post(
            `${process.env.ORDER_SERVICE_URL}/update-status`,{
                orderId:shipment.orderId,
                status
            }
        );
    
        logger.info("Order service notified", {
                orderId: shipment.orderId
        });

    } catch (error) {
        logger.error("Failed to notify order service", {
            orderId: shipment.orderId,
            error: error.message
        });
    }

    res.status(200).json({message:"shipment status updated",shipment:shipment});
})


export const trackShipment = asyncHandler(async(req,res)=>{
    const trackingNumber = req.params.trackingNumber;

    logger.debug("Tracking shipment request", { trackingNumber });

    const shipment = await Shipping.findOne({
        trackingNumber:trackingNumber
    });

    if(!shipment){
        logger.warn("Shipment not found during tracking", { trackingNumber });
        return res.status(404).json({message:"Shipment details not found"})
    }

    
    res.status(200).json(shipment);
}) 