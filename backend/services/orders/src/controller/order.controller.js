import asyncHandler from "express-async-handler"
import axios from "axios"
import Orders from "../db/order.model.js";
import {publisher} from "../events/eventBus.js"


export const createOrder =  asyncHandler(async(req,res)=>{
    const userId = req.headers["x-user-id"];

    //Get cart
    const {data:cart} = await axios.get(
        `${process.env.CART_SERVICE_URL}/`,
        {headers:{"x-user-id":userId}}
    )

    if(!cart.items.length){
        return res.status(400).json({message:"Cart is empty."})
    }

    let total =0;

    //Validate stock from product service
    for(const item of cart.items){
        const {data} = await axios.post(
            `${process.env.PRODUCT_SERVICE_URL}/validate-stock`,
            {
                productId:item.productId,
                quantity:item.quantity
            }
        )
        
        
        if(!data.available){
            return res.status(400).json({
                message:`Product ${item.productId} out of stock.`
            })
        }

        total += data.price * item.quantity;
    }

    //Create order (pending)
    const order = await Orders.create({
        userId,
        items:cart.items,
        totalAmount:total
    });

    res.status(201).json(order)
})


export const getMyOrders = asyncHandler(async(req,res)=>{
    const userId = req.headers["x-user-id"];

    const orders = await Orders.find({userId}).sort({createdAt:-1});

    res.status(200).json(orders)
})



export const confirmPayment = asyncHandler(async(req,res)=>{

     const {orderId, paymentId, success , address} = req.body;

     const order = await Orders.findById(orderId);
     
     if(!order){
        return res.status(404).json({message:"order not found"});
     }

     order.paymentStatus = success ? "success" : "failed";
     order.status = success ? "paid" : "cancelled";
     order.paymentId = paymentId;


    //  if(success){
    //     //deduct stock
    //     try {
    //         await axios.post(
    //             `${process.env.PRODUCT_SERVICE_URL}/deduct-stock`,
    //             {items:order.items},
    //         )
    //     } catch (error) {
    //         console.error("Failed to deduct stock: ",error.response?.data?.message)
    //     }

    //     //clear cart
    //     try {
    //         await axios.delete(
    //             `${process.env.CART_SERVICE_URL}/clear`,
    //             {headers:{"x-user-id":order.userId}}
    //         )
    //     } catch (error) {
    //          console.error("Failed to clear cart: ",error.response?.data?.message)
    //     }

    //     //create shipment
    //     try {
    //         await axios.post(
    //             `${process.env.SHIPMENT_SERVICE_URL}/`,{
    //                 userId:order.userId,
    //                 orderId:orderId,
    //                 address:address
    //             }
    //         );
    //     } catch (error) {
    //         console.error("Failed to create shipment: ",error.response?.data)
    //     }

        
    //     try {
    //         //getUser
    //         const {data:user} = await axios.get(
    //             `${process.env.USER_SERVICE_URL}/users/${order.userId}`,
    //         )

    //         //send mail
    //         await axios.post(
    //             `${process.env.NOTIFICATION_SERVICE_URL}/`,{
    //                 to:user.email,
    //                 subject:"order confirmed",
    //                 html:`<h1>Your order ${orderId} is confirmed</h1>`
    //             }
    //         )
    //     } catch (error) {

    //         if (error.response) {
    //             // Server responded with error status
    //             console.error("Email service error:");
    //             console.error("Status:", error.response.status);
    //             console.error("Data:", error.response.data);
    //         } 
    //         else if (error.request) {
    //             // Request made but no response
    //             console.error("No response from notification service");
    //         } 
    //         else {
    //             // Something else happened
    //             console.error("Error:", error.message);
    //         }

    //     }


    if (success){
        //deducts stock
        //clear cart
        //create shipment
        //notify user
        //getUser
             const {data:user} = await axios.get(
                 `${process.env.USER_SERVICE_URL}/users/${order.userId}`,
             )
        await publisher.publish(
            "ORDER_CONFIRMED",
            JSON.stringify({
                orderId:order.id,
                userId:order.userId,
                items:order.items,
                email:user.email,
                address
            })
        )
    }

     await order.save();
     
     res.status(200).json({ message: "Payment confirmed"});
    
})


export const updateOrderStatus = asyncHandler(async(req,res)=>{
    const {orderId, status} = req.body;

    const order = await Orders.findByIdAndUpdate(
        {_id:orderId},
        {status},
        {new:true}
    )

    if(!order){
        return res.status(404).json({message:"Order not found"});
    }

    res.status(200).json({message:"Order status updated"})
})