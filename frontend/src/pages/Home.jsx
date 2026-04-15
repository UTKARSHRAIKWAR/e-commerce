import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Truck, Clock } from "lucide-react";

import ProductCard from "../components/products/ProductCard";
import { SkeletonProductCard } from "../components/common/Skeleton";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";

const Home = () => {
  const [products, setProducts] = useState({
    featured: [],
    deals: [],
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHome = async () => {
      try {
        setLoading(true);

        const [prodRes, catRes] = await Promise.all([
          productService.getProducts({ limit: 8 }),
          categoryService.getCategories(),
        ]);

        const allProducts = prodRes?.products || [];
        const allCategories = catRes || [];

        setProducts({
          featured: allProducts.slice(0, 8),
          deals: allProducts.filter((item) => item.discount > 0).slice(0, 8),
        });

        setCategories(allCategories);
      } catch (error) {
        console.error("Home load failed", error);
      } finally {
        setLoading(false);
      }
    };

    loadHome();
  }, []);

  return (
    <div className="space-y-14 md:space-y-20 pb-10">
      {/* HERO */}
      <section className="px-3 sm:px-5 lg:px-8 pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
          {/* background glow */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary-500/20 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 blur-3xl rounded-full" />

          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 py-14 sm:py-20 lg:py-28 grid lg:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wider text-primary-300 mb-5">
                NEW COLLECTION 2026
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight">
                Shop Smart.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">
                  Live Better.
                </span>
              </h1>

              <p className="mt-5 text-sm sm:text-base lg:text-lg text-gray-300 max-w-xl leading-relaxed">
                Discover premium products curated for modern lifestyles. Better
                quality, faster delivery, smarter shopping.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 hover:bg-primary-500 px-7 py-3.5 text-white font-bold transition"
                >
                  Shop Now <ArrowRight size={18} />
                </Link>

                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-3.5 text-white hover:bg-white/10 transition"
                >
                  Explore Deals
                </Link>
              </div>
            </div>

            {/* Right */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-full max-w-xl">
                <img
                  src="https://placehold.co/700x500/111827/ffffff?text=Premium+Shopping"
                  alt="shopping"
                  className="rounded-3xl shadow-2xl border border-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST FEATURES */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            {
              icon: Truck,
              title: "Free Shipping",
              desc: "Orders over ₹999",
            },
            {
              icon: Shield,
              title: "Secure Payment",
              desc: "100% Protected",
            },
            {
              icon: Clock,
              title: "24/7 Support",
              desc: "Always Available",
            },
            {
              icon: Star,
              title: "Top Rated",
              desc: "Trusted Products",
            },
          ].map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                  <Icon size={22} />
                </div>

                <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                  {item.title}
                </h4>

                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                Shop by Category
              </h2>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">
                Find exactly what you need
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {categories.slice(0, 4).map((category, i) => (
                <Link
                  key={category._id || i}
                  to={`/products?category=${category.name.toLowerCase()}`}
                  className="group relative overflow-hidden rounded-2xl aspect-square"
                >
                  <img
                    src={
                      category.image ||
                      "https://placehold.co/400x400/f1f5f9/334155?text=Category"
                    }
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-base sm:text-lg">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                Featured Products
              </h2>
              <p className="text-gray-500 mt-1">Handpicked for you</p>
            </div>

            <Link
              to="/products"
              className="hidden sm:flex items-center gap-1 text-primary-600 font-semibold hover:underline"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {loading
              ? [...Array(4)].map((_, i) => <SkeletonProductCard key={i} />)
              : products.featured.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
          </div>
        </div>
      </section>

      {/* DEALS */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-primary-50 to-indigo-50 p-5 sm:p-8 lg:p-10 border border-primary-100">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                Best Deals Today
              </h2>
              <p className="text-gray-600 mt-1">
                Limited time offers on top products
              </p>
            </div>

            <Link to="/products" className="text-primary-600 font-semibold">
              Explore All →
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {loading
              ? [...Array(4)].map((_, i) => <SkeletonProductCard key={i} />)
              : products.deals.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
