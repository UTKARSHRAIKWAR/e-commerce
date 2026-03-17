import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Trash2, Minus, Plus } from "lucide-react";
import { cartService } from "../services/cartService";
import { setCart, clearCartLocal } from "../store/slices/cartSlice";
import toast from "react-hot-toast";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.cart);

  const loadCart = async () => {
    try {
      const cart = await cartService.getCart();
      dispatch(setCart(cart));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const removeItem = async (productId) => {
    try {
      const cart = await cartService.removeItem(productId);
      dispatch(setCart(cart));
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const updateQty = async (productId, qty, change) => {
    const newQty = qty + change;

    if (newQty < 1) return;

    try {
      const cart = await cartService.updateQuantity(productId, newQty);
      dispatch(setCart(cart));
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      dispatch(clearCartLocal());
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold">Cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {items.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center border-b py-4"
        >
          <div>
            <p className="font-semibold">Product ID: {item.productId}</p>
            <p>${item.price}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => updateQty(item.productId, item.quantity, -1)}
            >
              <Minus size={16} />
            </button>

            <span>{item.quantity}</span>

            <button onClick={() => updateQty(item.productId, item.quantity, 1)}>
              <Plus size={16} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <p className="font-bold">
              ${(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeItem(item.productId)}
              className="text-red-500"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}

      <div className="mt-6 flex justify-between items-center">
        <button onClick={clearCart} className="text-red-600">
          Clear Cart
        </button>

        <h2 className="text-xl font-bold">Total: ${totalPrice}</h2>
      </div>
    </div>
  );
};

export default Cart;
