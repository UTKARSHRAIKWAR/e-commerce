import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Shield,
  Truck,
  Clock3,
  Sparkles,
} from "lucide-react";

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
    loadHome();
  }, []);

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
      console.error("Home page load failed", error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      desc: "On orders above ₹999",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      desc: "100% protected checkout",
    },
    {
      icon: Clock3,
      title: "Fast Delivery",
      desc: "Quick & reliable service",
    },
    {
      icon: Star,
      title: "Top Rated",
      desc: "Loved by customers",
    },
  ];

  return (
    <div className="pb-14 space-y-14 md:space-y-20">
      {/* HERO */}
      <section className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
          {/* glow effects */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/20 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 blur-3xl rounded-full" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-14 md:py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-primary-300 text-xs sm:text-sm font-semibold mb-6">
                <Sparkles size={14} />
                New Collection 2026
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight text-white">
                Shop Better.
                <span className="block bg-gradient-to-r from-primary-400 to-indigo-400 text-transparent bg-clip-text">
                  Live Smarter.
                </span>
              </h1>

              <p className="mt-5 text-sm sm:text-base lg:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0">
                Premium products for modern lifestyles. Fast delivery, trusted
                quality, and unbeatable deals.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-all duration-300 hover:scale-105"
                >
                  Shop Now <ArrowRight size={18} />
                </Link>

                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-white/15 text-white hover:bg-white/10 transition"
                >
                  Explore Deals
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div className="hidden lg:flex justify-center">
              <img
                src="https://placehold.co/700x500/111827/ffffff?text=Premium+Shopping"
                alt="hero"
                className="rounded-3xl shadow-2xl border border-white/10 hover:scale-[1.02] transition duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                  <Icon size={22} />
                </div>

                <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                  {item.title}
                </h3>

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
        <SectionHeader
          title="Shop by Category"
          subtitle="Find what you need instantly"
        />

        {loading ? (
          <CategorySkeleton />
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.slice(0, 4).map((category, i) => (
              <Link
                key={category._id || i}
                to={`/products?category=${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-3xl aspect-square"
              >
                <img
                  src={
                    category.image ||
                    "https://placehold.co/500x500/f3f4f6/111827?text=Category"
                  }
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Featured Products"
          subtitle="Picked specially for you"
          link="/products"
        />

        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonProductCard key={i} />)
            : products.featured.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
        </div>
      </section>

      {/* DEALS */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-100 p-5 sm:p-8 lg:p-10">
          <SectionHeader
            title="Best Deals Today"
            subtitle="Limited time offers on top products"
            link="/products"
            inside
          />

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

/* Reusable Components */

const SectionHeader = ({ title, subtitle, link, inside }) => {
  return (
    <div
      className={`max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 ${
        inside ? "" : ""
      }`}
    >
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
          {title}
        </h2>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">{subtitle}</p>
      </div>

      {link && (
        <Link
          to={link}
          className="text-primary-600 font-semibold hover:underline inline-flex items-center gap-1"
        >
          View All <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
};

const CategorySkeleton = () => (
  <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="aspect-square rounded-3xl bg-gray-200 animate-pulse"
      />
    ))}
  </div>
);

export default Home;
