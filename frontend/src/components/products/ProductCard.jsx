import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { setCart } from "../../store/slices/cartSlice";
import { toggleWishlistItem } from "../../store/slices/wishlistSlice";
import { cartService } from "../../services/cartService";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();

    try {
      const cart = await cartService.addToCart({
        productId: product._id,
        quantity: 1,
      });

      dispatch(setCart(cart));

      toast.success("Added to cart!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();

    dispatch(toggleWishlistItem(product));

    toast.success(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist!",
    );
  };

  const image =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://placehold.co/400x300?text=Product";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 flex items-center justify-center p-6">
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white z-10 transition-colors shadow-sm"
        >
          <Heart
            size={18}
            className={isWishlisted ? "fill-red-500 text-red-500" : ""}
          />
        </button>

        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Info Section */}
      <div className="p-5 flex flex-col flex-1">
        {/* Product Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-bold text-gray-900 leading-tight mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>

        {/* Ratings */}
        <div className="flex items-center gap-1 mt-3 text-sm text-gray-600">
          <Star size={16} className="text-yellow-400 fill-yellow-400" />
          {product.averageRatings || 0}
          <span className="text-gray-400">({product.ratingCount || 0})</span>
        </div>

        {/* Price + Cart */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price}
          </span>

          <button
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 transform active:scale-95"
            title="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
