import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, Clock } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import { SkeletonProductCard } from '../components/common/Skeleton';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

// Mock data fallback in case API is down
const MOCK_CATEGORIES = [
  { id: 1, name: 'Electronics', image: 'https://placehold.co/300x300/e2e8f0/475569?text=Electronics' },
  { id: 2, name: 'Fashion', image: 'https://placehold.co/300x300/e2e8f0/475569?text=Fashion' },
  { id: 3, name: 'Home & Kitchen', image: 'https://placehold.co/300x300/e2e8f0/475569?text=Home' },
  { id: 4, name: 'Sports', image: 'https://placehold.co/300x300/e2e8f0/475569?text=Sports' },
];

const MOCK_PRODUCTS = [
  { _id: '1', title: 'Wireless Noise Cancelling Headphones', price: 299.99, discount: 15, category: 'Electronics', image: 'https://placehold.co/400x400/f8fafc/334155?text=Headphones' },
  { _id: '2', title: 'Minimalist Minimal Watch', price: 199.50, discount: 0, category: 'Fashion', image: 'https://placehold.co/400x400/f8fafc/334155?text=Watch' },
  { _id: '3', title: 'Smart Home Security Camera', price: 89.99, discount: 20, category: 'Electronics', image: 'https://placehold.co/400x400/f8fafc/334155?text=Camera' },
  { _id: '4', title: 'Ergonomic Office Chair', price: 249.00, discount: 10, category: 'Home & Kitchen', image: 'https://placehold.co/400x400/f8fafc/334155?text=Chair' },
];

const Home = () => {
  const [products, setProducts] = useState({ featured: [], deals: [] });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Attempt to fetch from API
        const [prodRes, catRes] = await Promise.all([
          productService.getProducts({ limit: 8 }),
          categoryService.getCategories().catch(() => MOCK_CATEGORIES)
        ]);
        
        const fetchedProducts = prodRes?.products || MOCK_PRODUCTS;
        
        setProducts({
          featured: fetchedProducts.slice(0, 4),
          deals: fetchedProducts.filter(p => p.discount > 0).slice(0, 4) || MOCK_PRODUCTS.filter(p => p.discount > 0)
        });
        setCategories(catRes || MOCK_CATEGORIES);
      } catch (error) {
        // Fallback to mock data if API is entirely unavailable
        console.warn("Using mock data due to API error", error);
        setProducts({
          featured: MOCK_PRODUCTS.slice(0, 4),
          deals: MOCK_PRODUCTS.filter(p => p.discount > 0).slice(0, 4)
        });
        setCategories(MOCK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 lg:space-y-24">
      
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden mx-4 sm:mx-6 lg:mx-8 rounded-3xl mt-6">
        <div className="absolute inset-0 z-0 opacity-40">
           <img src="https://placehold.co/1920x600/111827/475569?text=Modern+Shopping" alt="Hero background" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-32 flex flex-col items-start justify-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary-500/20 text-primary-400 font-semibold tracking-wider text-sm mb-4 border border-primary-500/30">
            NEW SPRING COLLECTION
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-2xl leading-tight">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Lifestyle</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-10 leading-relaxed">
            Discover premium products designed to bring comfort, style, and productivity to your everyday life.
          </p>
          <Link to="/products" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full bg-primary-600 text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-600/30 transition-all duration-300 gap-2 transform hover:-translate-y-1">
            Shop Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Features/Trust Banners */}
      <section className="py-8 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center space-y-3 p-4 group">
              <div className="w-14 h-14 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Free Shipping</h4>
                <p className="text-sm text-gray-500 mt-1">On orders over $99</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-4 group">
              <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Secure Payment</h4>
                <p className="text-sm text-gray-500 mt-1">100% secure checkout</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-4 group">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">24/7 Support</h4>
                <p className="text-sm text-gray-500 mt-1">Dedicated online support</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-4 group">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Star size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Top Reviews</h4>
                <p className="text-sm text-gray-500 mt-1">From verified buyers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Top Categories</h2>
            <p className="text-gray-500 mt-2">Find exactly what you are looking for</p>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-2xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category, index) => (
              <Link 
                key={category.id || index} 
                to={`/products?category=${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-2xl aspect-square shadow-sm"
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                <h3 className="absolute bottom-6 left-6 text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Featured Products</h2>
            <p className="text-gray-500 mt-2">Handpicked for you with love</p>
          </div>
          <Link to="/products" className="hidden sm:flex items-center font-medium text-primary-600 hover:text-primary-700 gap-1 hover:underline">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            [...Array(4)].map((_, i) => <SkeletonProductCard key={i} />)
          ) : (
            products.featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* Best Deals */}
      <section className="bg-primary-50/50 py-16 mt-16 border-y border-primary-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
               <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Best Deals Today</h2>
               <p className="text-gray-500 mt-2">Unbeatable prices on premium items. Grab them fast!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [...Array(4)].map((_, i) => <SkeletonProductCard key={i} />)
            ) : (
              products.deals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;
