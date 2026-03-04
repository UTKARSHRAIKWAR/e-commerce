import axios from "axios";
import asyncHandler from "express-async-handler"
import Payment from "../db/payment.model.js"

export const processPayment = asyncHandler(async(req,res)=>{
    const userId = req.headers["x-user-id"]; 
    const {orderId , amount , address} = req.body;

    const success = true;

    const payment = await Payment.create({
        orderId,
        userId,
        amount,
        status: success ? "success" : "false",
        provider:"stripe"
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
    } catch (error) {
        console.error("Order confirmation failed:" , error.response?.data)
    }
    
    res.json(payment)
})