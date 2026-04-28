import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Check,
  ShieldCheck,
  ChevronLeft,
  CreditCard,
  Truck,
  User,
} from "lucide-react";
import { clearCartLocal } from "../store/slices/cartSlice";
import { orderService } from "../services/orderService";
import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const shipping = totalPrice > 999 ? 0 : 99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shipping + tax;

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await orderService.createOrder({
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
        paymentMethod: "CARD",
      });

      dispatch(clearCartLocal());
      toast.success("Order placed successfully");
      navigate("/orders");
    } catch (error) {
      toast.error("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* Back */}
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition mb-6"
      >
        <ChevronLeft size={18} />
        Back to Cart
      </Link>

      {/* Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="xl:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Secure Checkout
          </h1>

          <form
            id="checkout-form"
            onSubmit={handleCheckout}
            className="space-y-6"
          >
            {/* Contact */}
            <SectionCard icon={<User size={18} />} title="Contact Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />

                <div className="md:col-span-2">
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </SectionCard>

            {/* Shipping */}
            <SectionCard icon={<Truck size={18} />} title="Shipping Address">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <Input
                    label="Street Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />

                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />

                <Input
                  label="ZIP Code"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                />
              </div>
            </SectionCard>

            {/* Payment */}
            <SectionCard
              icon={<CreditCard size={18} />}
              title="Payment Details"
              right={
                <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                  <ShieldCheck size={16} />
                  Secure
                </span>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <Input
                    label="Card Number"
                    name="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <Input
                  label="Expiry"
                  name="expiry"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={handleInputChange}
                />

                <Input
                  label="CVC"
                  name="cvc"
                  placeholder="123"
                  value={formData.cvc}
                  onChange={handleInputChange}
                />
              </div>
            </SectionCard>
          </form>
        </div>

        {/* RIGHT */}
        <div>
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => {
                const finalPrice = item.discount
                  ? item.price - item.price * (item.discount / 100)
                  : item.price;

                return (
                  <div key={item.productId || item._id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 border overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {item.title}
                      </h4>

                      <div className="flex justify-between mt-1 text-sm">
                        <span className="text-gray-500">
                          Qty {item.quantity}
                        </span>

                        <span className="font-semibold text-gray-900">
                          ₹{(finalPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="border-y my-6 py-5 space-y-3 text-sm">
              <Row title="Subtotal" value={`₹${totalPrice.toFixed(2)}`} />
              <Row
                title="Shipping"
                value={
                  shipping === 0 ? (
                    <span className="text-emerald-600 font-semibold">Free</span>
                  ) : (
                    `₹${shipping.toFixed(2)}`
                  )
                }
              />
              <Row title="Tax" value={`₹${tax.toFixed(2)}`} />
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-semibold">Total</span>
              <span className="text-3xl font-bold text-gray-900">
                ₹{orderTotal.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-gray-900 text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 transition disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Place Order <Check size={18} />
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-500 mt-4 leading-5">
              By placing this order, you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Components */

const SectionCard = ({ title, icon, right, children }) => (
  <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-5 md:p-7">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <span className="text-primary-600">{icon}</span>
        <h2 className="text-lg md:text-xl font-bold text-gray-900">{title}</h2>
      </div>
      {right}
    </div>
    {children}
  </div>
);

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>

    <input
      required
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition"
    />
  </div>
);

const Row = ({ title, value }) => (
  <div className="flex justify-between text-gray-600">
    <span>{title}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

export default Checkout;
