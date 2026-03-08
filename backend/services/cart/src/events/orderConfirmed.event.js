import { subscriber } from "./eventBus.js";
import Cart from "../db/cart.model.js"

subscriber.subscribe("ORDER_CONFIRMED",async (message) => {

    const data = JSON.parse(message);

    await Cart.findOneAndUpdate(
        {userId:data.userId},
        {items:[]}
    );

    console.log("Cart cleared:",data.userId);
})