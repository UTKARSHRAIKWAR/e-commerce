import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Package, Clock, CheckCircle } from 'lucide-react';
import Loader from '../components/common/Loader';
import { orderService } from '../services/orderService';
import { Link } from 'react-router-dom';

const MOCK_ORDERS = [
  {
    _id: 'ORD-1234567890',
    createdAt: new Date().toISOString(),
    status: 'Delivered',
    totalAmount: 349.99,
    items: [
      { title: 'Wireless Noise Cancelling Headphones', quantity: 1, image: 'https://placehold.co/100x100?text=Headphones' }
    ]
  },
  {
    _id: 'ORD-0987654321',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Processing',
    totalAmount: 129.50,
    items: [
      { title: 'Minimalist Minimal Watch', quantity: 1, image: 'https://placehold.co/100x100?text=Watch' }
    ]
  }
];

const Orders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Normally user._id
        const res = await orderService.getUserOrders(user?.id || 'mockUserId').catch(() => MOCK_ORDERS);
        setOrders(res || MOCK_ORDERS);
      } catch (err) {
        setOrders(MOCK_ORDERS);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Orders</h1>
        <p className="text-gray-500 mt-2">Check the status of your recent orders, manage returns, and discover similar products.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Package size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            You haven't placed any orders yet. Start exploring our amazing collection!
          </p>
          <Link to="/products" className="inline-block px-6 py-3 bg-primary-600 text-white font-bold rounded-full hover:bg-primary-500 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 p-6 flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-100 gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Order Date</span>
                    <span className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Amount</span>
                    <span className="text-sm font-medium text-gray-900">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="col-span-2 md:col-span-2 md:text-right">
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Order ID</span>
                    <span className="text-sm font-medium text-gray-900">#{order._id}</span>
                  </div>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  {order.status === 'Delivered' ? (
                    <CheckCircle className="text-emerald-500" size={20} />
                  ) : (
                    <Clock className="text-primary-500" size={20} />
                  )}
                  <h3 className={`font-bold text-lg ${order.status === 'Delivered' ? 'text-emerald-600' : 'text-primary-600'}`}>
                    {order.status}
                  </h3>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:border-primary-100 hover:bg-primary-50/30 transition-colors">
                      <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                         <img src={item.image} alt={item.title} className="w-full h-full object-contain p-2" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                        <span className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</span>
                      </div>
                      <div className="hidden sm:flex self-center">
                        <button className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-200 bg-white rounded-lg hover:bg-primary-50 transition-colors">
                          Buy Again
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
