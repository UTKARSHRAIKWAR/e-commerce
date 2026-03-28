import axios from "axios";
import asyncHandler from "express-async-handler"
import Payment from "../db/payment.model.js"
import logger from "../utils/logger.js";

export const processPayment = asyncHandler(async(req,res)=>{
    const userId = req.headers["x-user-id"]; 
    const {orderId , amount , address} = req.body;

    logger.info("Payment request received", {
        orderId,
        userId,
        amount
    });

    const success = true;

    const payment = await Payment.create({
        orderId,
        userId,
        amount,
        status: success ? "success" : "false",
        provider:"stripe"
    });

     logger.info("Payment record created", {
        paymentId: payment._id,
        orderId,
        status: payment.status
    });


    try {
        await axios.post(
            `${process.env.ORDER_SERVICE_URL}/confirm-payment`,
            {
                orderId,
                paymentId:payment._id,
                success,
                address
            }
        );
        logger.info("Order service notified successfully", { orderId });
    } catch (error) {
        logger.error("Order confirmation failed", {
            orderId,
            error: error.message,
            response: error.response?.data
        });
    }

    logger.info("Payment API response sent", {
        paymentId: payment._id
    });
    
    res.json(payment)
})