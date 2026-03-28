import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, Star, Minus, Plus, Heart } from "lucide-react";
import { useDispatch } from "react-redux";
import { productService } from "../services/productService";
import { cartService } from "../services/cartService";
import { setCart } from "../store/slices/cartSlice";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductById(id);
        setProduct(res);
      } catch {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await cartService.addToCart(product._id, quantity);
      const cart = await cartService.getCart();
      dispatch(setCart(cart));
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) return <Loader />;
  if (!product) return <div>Product not found</div>;

  const images =
    product.images?.length > 0
      ? product.images
      : ["https://placehold.co/600x600"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* LEFT - IMAGE GALLERY */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          <div className="flex flex-col gap-3">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer border ${
                  activeImage === i ? "border-primary-600" : "border-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 bg-white rounded-2xl p-6 border overflow-hidden group">
            <img
              src={images[activeImage]}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>

        {/* RIGHT - PRODUCT INFO */}
        <div className="flex flex-col">
          {/* Title */}
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

          {/* Ratings */}
          <div className="flex items-center gap-2 mb-4">
            <Star className="text-yellow-400 fill-yellow-400" size={18} />
            {product.averageRatings || 0}
            <span className="text-gray-500 text-sm">
              ({product.ratingCount || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="text-3xl font-extrabold text-gray-900 mb-6">
            ₹{product.price}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Quantity + Actions */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="px-3 py-2"
              >
                <Minus size={16} />
              </button>

              <span className="px-4 font-semibold">{quantity}</span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-500 transition"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>

            <button className="p-3 border rounded-xl hover:text-red-500">
              <Heart size={18} />
            </button>
          </div>

          {/* Highlights */}
          <div className="space-y-3 text-sm text-gray-600">
            <p>✔ Free delivery available</p>
            <p>✔ 7 days replacement</p>
            <p>✔ Secure checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
