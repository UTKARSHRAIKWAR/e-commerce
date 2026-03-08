import { subscriber } from "../events/eventBus.js";
import Products from "../db/product.model.js";

subscriber.subscribe("ORDER_CONFIRMED", async (message) => {

  const data = JSON.parse(message);

  for (const item of data.items) {

    await Products.findOneAndUpdate(
      {
        _id: item.productId,
        stockQuantity: { $gte: item.quantity }
      },
      {
        $inc: { stockQuantity: -item.quantity }
      }
    );

  }

  console.log("Stock updated for order:", data.orderId);

});