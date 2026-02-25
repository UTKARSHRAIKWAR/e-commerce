import asyncHandler from "express-async-handler"
import axios from "axios"
import Orders from "../db/order.model.js";
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
    const order = Orders({
        userId,
        items:cart.items,
        totalAmount:total
    });

    res.status(201).json(order)
})