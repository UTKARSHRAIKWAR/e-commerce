import axios from "axios"
import Cart from "../db/cart.model.js";
import logger from "../utils/logger.js";

export const addToCart = async(req,res,next)=>{
try {
    const userId = req.headers["x-user-id"];
    const {productId, quantity} = req.body;
    
    //get product info from product service
    const {data} = await axios.get(
        `${process.env.PRODUCT_SERVICE_URL}/${productId}`
    );  
    

    if(!data || !data.isActive){
        logger.warn(`Product ${productId} not found or inactive`);
        return res.status(404).json({message:"Product not found."})
    }

    let cart = await Cart.findOne({userId});

    if(!cart){
        cart = await Cart.create({
            userId,
            items:[{productId, quantity, price:data.price}]
        })
        logger.info(`New cart created for user ${userId}`);
    } else {
        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
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
        logger.info(`Cart updated for user ${userId}`);
    }

    res.status(200).json({cart});


} catch (error) {
    logger.error(`Add to cart failed: ${error.message}`);
    next(error);
}
}


export const getCart = async(req,res)=>{
    const userId = req.headers["x-user-id"];

    const cart = await Cart.findOne({userId});

    if(!cart){
        logger.warn(`Cart not found for user ${userId}`);
        return res.json({items:[],total:0})
    }

    const total = cart.items.reduce(
    (acc,item) => acc + item.quantity * item.price,
    0
    );

    logger.debug(`Cart total calculated for user ${userId}: ${total}`);
    res.json({
        items:cart.items,
        total
    });
}


export const removeFromCart = async(req,res)=>{
    const userId = req.headers["x-user-id"];
    const {productId} = req.params;

    const cart = await Cart.findOne({userId});

    if(!cart){
        logger.warn(`Cart not found while removing item for user ${userId}`);
        res.status(404).json({message:"Cart not found."})
    }

    cart.items = cart.items.filter(
        item => item.productId !== productId
    );

    await cart.save();

    logger.info(`Product ${productId} removed from cart`);

    res.json(cart);  
}


export const clearCart = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    logger.info(`Clear cart request for user ${userId}`);

    if (!userId) {
        logger.warn(`Unauthorized cart clear attempt`);
        return res.status(401).json({ message: "Unauthorized" });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    logger.info(`Cart cleared for user ${userId}`);

    res.status(200).json({ message: "Cart cleared", cart: updatedCart });

  } catch (error) {
    logger.error(`Clear cart error: ${error.message}`);
    next(error);
  }
};