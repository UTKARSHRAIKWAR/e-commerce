import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, Star, Minus, Plus, Heart } from "lucide-react";
import { useDispatch } from "react-redux";
import { productService } from "../services/productService";
import { cartService } from "../services/cartService";
import { setCart } from "../store/slices/cartSlice";
import Loader from "../components/common/Loader";
import ProductCard from "../components/products/ProductCard";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await productService.getProductById(id);
        setProduct(res);

        // fetch related products
        const rel = await productService.getProducts({
          category: res.category,
        });

        setRelated(rel.products || []);
      } catch {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🧠 Image zoom logic
  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  const handleAddToCart = async () => {
    try {
      await cartService.addToCart({
        productId: product._id,
        quantity: 1,
      });
      const cart = await cartService.getCart();
      dispatch(setCart(cart));

      toast.success("Added to cart 🛒");
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
        {/* LEFT - IMAGE */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          <div className="flex flex-col gap-3">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 rounded-lg cursor-pointer border ${
                  activeImage === i ? "border-primary-600" : "border-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Main Image with Zoom */}
          <div
            className="flex-1 bg-white rounded-2xl p-6 border overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={images[activeImage]}
              style={zoomStyle}
              className="w-full h-full object-contain transition-transform duration-200"
            />
          </div>
        </div>

        {/* RIGHT - STICKY BUY BOX */}
        <div className="sticky top-24 h-fit">
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < Math.round(product.averageRatings || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="text-sm text-gray-500 ml-2">
              ({product.ratingCount || 0})
            </span>
          </div>

          {/* Price */}
          <div className="text-3xl font-extrabold mb-4">₹{product.price}</div>

          {/* Description */}
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex border rounded-lg">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="px-3"
              >
                <Minus />
              </button>

              <span className="px-4">{quantity}</span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3"
              >
                <Plus />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-500 transition"
            >
              Add to Cart
            </button>

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-3 border rounded-xl ${
                isWishlisted ? "text-red-500" : ""
              }`}
            >
              <Heart />
            </button>
          </div>

          {/* Trust badges */}
          <div className="text-sm text-gray-600 space-y-2">
            <p>✔ Free delivery</p>
            <p>✔ Secure payment</p>
            <p>✔ Easy returns</p>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {related.slice(0, 4).map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
