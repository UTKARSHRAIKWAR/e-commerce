import axios from "axios"
import Cart from "../db/cart.model.js";

export const addToCart = async(req,res,next)=>{
try {
    const userId = req.headers["x-user-id"];
    const {productId, quantity} = req.body;
    
    //get product info from product service
    const {data} = await axios.get(
        `${process.env.PRODUCT_SERVICE_URL}/${productId}`
    );

    if(!data || !data.isActive){
        return res.status(404).json({message:"Product not found."})
    }

    let cart = await Cart.findOne({userId});

    if(!cart){
        cart = await Cart.create({
            userId,
            items:[{productId, quantity, price:data.price}]
        })
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
    }

    res.status(200).json({cart});


} catch (error) {
    next(error);
}
}


export const getCart = async(req,res)=>{
    const userId = req.headers["x-user-id"];

    const cart = await Cart.findOne({userId});

    if(!cart){
        return res.json({items:[],total:0})
    }

    const total = cart.items.reduce(
    (acc,item) => acc + item.quantity * item.price,
    0
    );

    res.json({
        items:cart.items,
        total
    });
}


export const removeFromCart = async(req,res)=>{
    const userId = req.headers["x-user-id"];
    const {productId} = req.body;

    const cart = await Cart.findOne({userId});

    if(!cart){
        res.status(404).json({message:"Cart not found."})
    }

    cart.items = cart.items.filter(
        item => item.productId !== productId
    );

    await cart.save();

    res.json(cart);  
}


export const clearCart = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];


    if (!userId) {
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

    res.status(200).json({ message: "Cart cleared", cart: updatedCart });

  } catch (error) {
    next(error);
  }
};