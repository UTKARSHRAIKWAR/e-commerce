import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { cartService } from "../services/cartService";
import { setCart, clearCartLocal } from "../store/slices/cartSlice";
import toast from "react-hot-toast";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, totalPrice } = useSelector((state) => state.cart);

  const [loading, setLoading] = useState(false);

  // Load cart
  const loadCart = async () => {
    try {
      setLoading(true);

      const cart = await cartService.getCart();

      dispatch(
        setCart({
          items: cart.items || [],
          total: cart.total || 0,
        }),
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Remove item
  const removeItem = async (productId) => {
    try {
      const cart = await cartService.removeCartItem(productId);

      dispatch(
        setCart({
          items: cart.items || [],
          total: cart.total || 0,
        }),
      );

      toast.success("Item removed");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  // Update quantity
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
          items: cart.items || [],
          total: cart.total || 0,
        }),
      );
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await cartService.clearCart();

      dispatch(clearCartLocal());

      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  const shipping = items.length > 0 ? (totalPrice > 999 ? 0 : 99) : 0;
  const finalTotal = totalPrice + shipping;

  // Loading UI
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="animate-pulse text-lg font-semibold text-gray-600">
          Loading your cart...
        </div>
      </div>
    );
  }

  // Empty cart UI
  if (!items || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-6">
          <ShoppingBag size={38} />
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-3">
          Your cart is empty
        </h2>

        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Looks like you haven’t added anything yet. Browse products and start
          shopping.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-7 py-3 rounded-full font-semibold hover:bg-primary-500 transition"
        >
          Start Shopping <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
          Shopping Cart
        </h1>

        <p className="text-gray-500 mt-2">
          {items.length} item{items.length > 1 ? "s" : ""} in your cart
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT SIDE - ITEMS */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
            {items.map((item, index) => {
              const itemTotal = item.price * item.quantity;

              return (
                <div
                  key={item.productId}
                  className={`p-4 sm:p-6 ${
                    index !== items.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Product Image */}
                    <div className="w-full sm:w-28 h-28 rounded-2xl bg-gray-100 overflow-hidden shrink-0">
                      <img
                        src={
                          item.image ||
                          "https://placehold.co/300x300/f1f5f9/334155?text=Item"
                        }
                        alt="product"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                            {item.name || "Product"}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            Product ID: {item.productId}
                          </p>

                          <p className="text-sm font-medium text-primary-600 mt-2">
                            ₹{item.price.toFixed(2)} each
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.productId)}
                          className="self-start text-gray-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Bottom Row */}
                      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Quantity */}
                        <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden w-fit">
                          <button
                            onClick={() =>
                              updateQty(item.productId, item.quantity, -1)
                            }
                            className="px-3 py-2 hover:bg-gray-50"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="px-4 font-semibold min-w-[40px] text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQty(item.productId, item.quantity, 1)
                            }
                            className="px-3 py-2 hover:bg-gray-50"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Total */}
                        <div className="text-lg font-black text-gray-900">
                          ₹{itemTotal.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Footer */}
            <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <button
                onClick={clearCart}
                className="text-red-600 font-semibold hover:text-red-700"
              >
                Clear Cart
              </button>

              <Link
                to="/products"
                className="text-primary-600 font-semibold hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - SUMMARY */}
        <div>
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-black text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>

                {shipping === 0 ? (
                  <span className="font-semibold text-green-600">Free</span>
                ) : (
                  <span className="font-semibold text-gray-900">
                    ₹{shipping.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="border-t pt-4 flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-6 h-12 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-500 transition"
            >
              Proceed to Checkout
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Secure checkout • Easy returns • Fast delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
