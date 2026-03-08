import Shipping from "../db/shipping.model.js";
import { subscriber } from "./eventBus.js";
import crypto from "crypto"

subscriber.subscribe("ORDER_CONFIRMED",async(message)=>{
    const data = JSON.parse(message);

    const trackingNumber = crypto.randomBytes(8).toString("hex");

    await Shipping.create({
        orderId:data.orderId,
        userId:data.userId,
        address:data.address,
        trackingNumber
    })

    console.log("Shipment created:",data.userId);
})