import axios from "axios"
import Cart from "../db/cart.model.js";
export const addToCart = async(req,res,next)=>{
try {
    const userId = req.headers["x-user-id"];
    const {productId, quantity} = req.body;

    //get product info from product service
    const {data} = await axios.get(
        `http://localhost:5000/product/${productId}`
    );

    if(!data || !data.isActive){
        return res.status(404).json({message:"Product not found."})
    }

    let cart = await Cart.findOne(userId);

    if(!cart){
        cart = await Cart.create({
            userId,
            items:[{productId, quantity, price:data.price}]
        })
    } else {
        const itemIndex = cart.items.findIndex(
            item => item.productId === productId
        );

        if(itemIndex > -1){
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({
                productId,
                quantity,
                price:data.price
            });
        }
        await cart.save();
    }

    res.status(200).json({cart});


} catch (error) {
    next(error);
}
}