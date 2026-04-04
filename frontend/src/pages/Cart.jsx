import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Trash2, Minus, Plus } from "lucide-react";
import { cartService } from "../services/cartService";
import { setCart, clearCartLocal } from "../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, totalPrice } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);

  // 🔥 Load cart from backend
  const loadCart = async () => {
    try {
      setLoading(true);

      const cart = await cartService.getCart();

      dispatch(
        setCart({
          items: cart.items || [],
          totalPrice: cart.total || 0,
        }),
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // 🔥 Remove item
  const removeItem = async (productId) => {
    try {
      const cart = await cartService.removeCartItem(productId);

      dispatch(
        setCart({
          items: cart.items,
          totalPrice: cart.total,
        }),
      );

      toast.success("Item removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

  // 🔥 Update quantity
  const updateQty = async (productId, qty, change) => {
    const newQty = qty + change;
    if (newQty < 1) return;

    try {
      const cart = await cartService.updateCartItem({
        productId,
        quantity: newQty,
      });

      dispatch(
        setCart({
          items: cart.items,
          totalPrice: cart.total,
        }),
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quantity");
    }
  };

  // 🔥 Clear cart
  const clearCart = async () => {
    try {
      await cartService.clearCart();

      dispatch(clearCartLocal());

      toast.success("Cart cleared");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear cart");
    }
  };

  // 🔥 Loading UI
  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-medium">
        Loading cart...
      </div>
    );
  }

  // 🔥 Empty cart UI
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold mb-4">Cart is empty</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {/* 🛒 Cart Items */}
      {items.map((item) => (
        <div
          key={item.productId}
          className="flex justify-between items-center border-b py-4"
        >
          {/* Product Info */}
          <div>
            <p className="font-semibold">Product ID: {item.productId}</p>
            <p className="text-gray-600">${item.price}</p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateQty(item.productId, item.quantity, -1)}
              className="p-1 border rounded"
            >
              <Minus size={16} />
            </button>

            <span className="font-medium">{item.quantity}</span>

            <button
              onClick={() => updateQty(item.productId, item.quantity, 1)}
              className="p-1 border rounded"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Price + Remove */}
          <div className="flex items-center gap-4">
            <p className="font-bold">
              ${(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeItem(item.productId)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}

      {/* 🧾 Footer */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button onClick={clearCart} className="text-red-600 font-medium">
          Clear Cart
        </button>

        <div className="flex items-center gap-6">
          <h2 className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</h2>

          {/* 🔥 Checkout Button */}
          <button
            onClick={() => navigate("/checkout")}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
