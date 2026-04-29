import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Socials */}
          <div>
            <Link
              to="/"
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 block mb-4"
            >
              ShopEZ
            </Link>
            <p className="text-gray-500 text-sm mb-6 max-w-xs leading-relaxed">
              Your one-stop destination for modern, high-quality electronics and
              fashion products.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-5 text-lg">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/products"
                  className="text-gray-500 hover:text-primary-600 text-sm transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=electronics"
                  className="text-gray-500 hover:text-primary-600 text-sm transition-colors"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=fashion"
                  className="text-gray-500 hover:text-primary-600 text-sm transition-colors"
                >
                  Fashion
                </Link>
              </li>
              <li>
                <Link
                  to="/deals"
                  className="text-gray-500 hover:text-primary-600 text-sm transition-colors"
                >
                  Daily Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-5 text-lg">
              Customer Service
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/profile"
                  className="text-gray-500 hover:text-primary-600 text-sm transition-colors"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-gray-500 hover:text-primary-600 text-sm transition-colors"
                >
                  Order History
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary-600 text-sm transition-colors"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-primary-600 text-sm transition-colors"
                >
                  Returns & Refunds
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-5 text-lg">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-primary-600 mt-0.5 flex-shrink-0"
                />
                <span className="text-gray-500 text-sm">Jabalpur</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary-600 flex-shrink-0" />
                <span className="text-gray-500 text-sm">+91 7898322916</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary-600 flex-shrink-0" />
                <span className="text-gray-500 text-sm">
                  utkarshraikwar.dev@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} ShopEZ. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="w-10 h-6 bg-gray-100 rounded text-[10px] text-gray-400 font-bold flex flex-col items-center justify-center">
              VISA
            </span>
            <span className="w-10 h-6 bg-gray-100 rounded text-[10px] text-gray-400 font-bold flex flex-col items-center justify-center">
              MC
            </span>
            <span className="w-10 h-6 bg-gray-100 rounded text-[10px] text-gray-400 font-bold flex flex-col items-center justify-center">
              AMEX
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
