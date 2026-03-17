import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingCart, Star, Shield, RefreshCw, Truck, Heart, Minus, Plus } from 'lucide-react';
import { addToCartLocal } from '../store/slices/cartSlice';
import Loader from '../components/common/Loader';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

const MOCK_PRODUCT = {
  _id: '1', title: 'Wireless Noise Cancelling Headphones', 
  price: 299.99, discount: 15, category: 'Electronics', 
  description: 'Experience pure sound with our active noise cancelling technology. Designed for all-day comfort and long-lasting battery life. Features include bluetooth 5.0, 30 hours battery life, built-in mic, and fast charging.',
  image: 'https://placehold.co/600x600/f8fafc/334155?text=Headphones',
  rating: 4.8, reviews: 124, inStock: true
};

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductById(id).catch(() => MOCK_PRODUCT);
        // Fallback to mock if it's returning empty or error
        setProduct(res?.title ? res : MOCK_PRODUCT);
      } catch (err) {
        setProduct(MOCK_PRODUCT);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    // Scroll to top when loading new product
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCartLocal({ ...product, quantity, productId: product._id }));
    toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  
  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (loading) return <Loader />;
  if (!product) return <div className="text-center py-20 text-xl font-medium">Product not found.</div>;

  const discountedPrice = product.discount 
    ? product.price - (product.price * (product.discount / 100))
    : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-300">/</span>
              <Link to={`/products?category=${product.category?.toLowerCase()}`} className="hover:text-primary-600 transition-colors capitalize">
                {product.category}
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-gray-800 font-medium truncate max-w-[200px] md:max-w-xs">{product.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Product Images */}
        <div className="bg-white rounded-3xl p-8 flex items-center justify-center shadow-sm border border-gray-100 group relative">
          {product.discount > 0 && (
            <span className="absolute top-6 left-6 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg z-10 shadow-sm">
              {product.discount}% OFF
            </span>
          )}
          <img 
            src={product.image || "https://placehold.co/600x600?text=Product"} 
            alt={product.title} 
            className="w-full max-w-md h-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2 text-sm text-primary-600 font-bold tracking-widest uppercase">
            {product.category}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {product.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < Math.floor(product.rating || 4) ? "currentColor" : "none"} className={i >= Math.floor(product.rating || 4) ? "text-gray-300" : ""} />
              ))}
            </div>
            <span className="text-sm text-gray-500 underline cursor-pointer">{product.reviews || 84} reviews</span>
            <span className="text-gray-300">|</span>
            <span className={`text-sm font-medium ${product.inStock !== false ? 'text-emerald-600' : 'text-red-600'}`}>
              {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="flex items-end gap-3 mb-8">
            <span className="text-4xl font-extrabold text-gray-900">${discountedPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="text-xl text-gray-400 line-through mb-1">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description || "Premium quality product crafted with excellence to meet all your needs. Durable, stylish, and highly recommended by professionals."}
          </p>

          <hr className="border-gray-100 mb-8" />

          {/* Add to Cart Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center border border-gray-200 rounded-xl bg-white w-32 h-14">
              <button 
                onClick={handleDecreaseQuantity}
                className="w-10 h-full flex justify-center items-center text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-l-xl transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="flex-1 text-center font-bold text-gray-900">{quantity}</span>
              <button 
                onClick={handleIncreaseQuantity}
                className="w-10 h-full flex justify-center items-center text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-r-xl transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={product.inStock === false}
              className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-xl font-bold text-white transition-all shadow-lg ${product.inStock !== false ? 'bg-primary-600 hover:bg-primary-500 hover:shadow-primary-600/30' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              <ShoppingCart size={20} />
              {product.inStock !== false ? 'Add to Cart' : 'Out of Stock'}
            </button>
            
            <button className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
              <Heart size={24} />
            </button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Truck className="text-primary-600" size={20} />
              <span className="text-sm font-medium text-gray-700">Free Worldwide Delivery</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <RefreshCw className="text-primary-600" size={20} />
              <span className="text-sm font-medium text-gray-700">30 Days Return Policy</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Shield className="text-primary-600" size={20} />
              <span className="text-sm font-medium text-gray-700">2 Year Warranty Setup</span>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16 sm:mt-24">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('description')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'description' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'specifications' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'reviews' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Customer Reviews (84)
            </button>
          </nav>
        </div>
        
        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none text-gray-600">
              <p>{product.description || "Full detailed description of the product. Including all marketing material and usage instructions to persuade the customer to buy this excellent item."}</p>
              <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
          )}
          {activeTab === 'specifications' && (
            <div className="overflow-hidden md:w-2/3 border border-gray-200 rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr><td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Weight</td><td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">1.2 lbs</td></tr>
                  <tr><td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Dimensions</td><td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">10 x 8 x 3 inches</td></tr>
                  <tr><td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Material</td><td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Premium Aluminum & Leather</td></tr>
                  <tr><td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Warranty</td><td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">2 Years Limited</td></tr>
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <p className="text-gray-600 italic">Reviews functionality is currently disabled. Please check back later.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;
