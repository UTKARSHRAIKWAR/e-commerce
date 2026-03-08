import { sendEmailEvent } from "../controllers/notification.controller.js";
import { subscriber } from "./eventBus.js";

subscriber.subscribe("ORDER_CONFIRMED",async(message)=>{
    const data = JSON.parse(message);
    
    await sendEmailEvent({
        to:data.email,
        subject:"Order Confirmed",
        html:`<h1>Your order ${data.orderId} is confirmed</h1>`
    })
})