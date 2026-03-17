import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { Heart, Trash2 } from 'lucide-react';
import { clearWishlist } from '../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  const handleClear = () => {
    dispatch(clearWishlist());
    toast.success('Wishlist cleared');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex justify-between items-end mb-8">
         <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Wishlist</h1>
          <p className="text-gray-500 mt-2">Products you have saved for later.</p>
         </div>
         {items.length > 0 && (
           <button 
             onClick={handleClear}
             className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
           >
             <Trash2 size={16} /> Clear All
           </button>
         )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-red-50 rounded-full flex flex-col items-center justify-center mx-auto mb-6 text-red-400">
             <Heart size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            Keep track of the items you love by adding them to your wishlist. Start exploring now!
          </p>
          <Link to="/products" className="inline-flex items-center justify-center px-8 py-3 text-base font-bold rounded-full bg-primary-600 text-white hover:bg-primary-500 hover:shadow-lg transition-all">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((product) => (
             <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
