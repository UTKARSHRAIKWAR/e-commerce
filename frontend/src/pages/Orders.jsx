import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Package,
  Clock,
  CheckCircle,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import Loader from "../components/common/Loader";
import { orderService } from "../services/orderService";
import { Link } from "react-router-dom";

const Orders = () => {
  const { user } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getUserOrders();
        setOrders(res || []);
      } catch (error) {
        console.error(error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "success":
      case "delivered":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "cancelled":
      case "failed":
        return "text-red-600 bg-red-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-500 mt-2">
          Track your purchases and payment status.
        </p>
      </div>

      {/* Empty Orders */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="text-gray-400" size={32} />
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            No Orders Found
          </h2>

          <p className="text-gray-500 mt-2 mb-6">
            Looks like you haven't placed any order yet.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition"
          >
            <ShoppingBag size={18} />
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gray-50 px-6 py-5 border-b border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Order ID
                  </p>
                  <p className="font-semibold text-sm text-gray-900 break-all">
                    {order._id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Date
                  </p>
                  <p className="font-semibold text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Total
                  </p>
                  <p className="font-semibold text-sm text-gray-900">
                    ₹{order.totalAmount}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Payment
                  </p>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.paymentStatus,
                    )}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Order Status */}
                <div className="flex items-center gap-2 mb-5">
                  {order.status === "paid" ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <Clock className="text-blue-500" size={20} />
                  )}

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {order.items?.map((item) => (
                    <div
                      key={item._id}
                      className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Product ID:
                        </h3>
                        <p className="text-sm text-gray-500 break-all">
                          {item.productId}
                        </p>

                        <p className="text-sm text-gray-600 mt-2">
                          Quantity: <strong>{item.quantity}</strong>
                        </p>

                        <p className="text-sm text-gray-600">
                          Price: <strong>₹{item.price}</strong>
                        </p>
                      </div>

                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition">
                        <CreditCard size={16} />
                        Buy Again
                      </button>
                    </div>
                  ))}
                </div>

                {/* Payment Id */}
                {order.paymentId && (
                  <div className="mt-5 text-sm text-gray-500 border-t pt-4">
                    Payment ID:{" "}
                    <span className="font-medium text-gray-800 break-all">
                      {order.paymentId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
