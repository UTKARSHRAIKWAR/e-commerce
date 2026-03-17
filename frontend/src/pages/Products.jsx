import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import { SkeletonProductCard } from "../components/common/Skeleton";
import { Filter, Check } from "lucide-react";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchKeyword = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";
  const pageParam = searchParams.get("page") || 1;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState("newest");

  const [page, setPage] = useState(Number(pageParam));
  const [pages, setPages] = useState(1);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // fetch categories
        // const cats = await categoryService.getCategories();
        // setCategories(cats);

        // fetch products with filters
        const params = {
          category: activeCategory,
          search: searchKeyword,
          sort: sortBy,
          page: page,
        };

        const res = await productService.getProducts(params);

        setProducts(res.products);
        setPages(res.pages || 1);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeCategory, sortBy, searchKeyword, page]);

  const handleCategorySelect = (categoryName) => {
    const params = new URLSearchParams(searchParams);

    if (categoryName) {
      params.set("category", categoryName);
    } else {
      params.delete("category");
    }

    setSearchParams(params);
    setActiveCategory(categoryName);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
    setPage(newPage);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shop All Products</h1>

        {searchKeyword && (
          <p className="text-gray-500 mt-2">
            Showing results for{" "}
            <span className="font-semibold">"{searchKeyword}"</span>
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <aside className="w-full lg:w-64 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Categories</h3>

          <ul className="space-y-3">
            <li>
              <button
                onClick={() => handleCategorySelect("")}
                className={`flex justify-between w-full ${
                  !activeCategory
                    ? "text-primary-600 font-semibold"
                    : "text-gray-600"
                }`}
              >
                All Products
                {!activeCategory && <Check size={16} />}
              </button>
            </li>

            {categories.map((cat) => (
              <li key={cat._id}>
                <button
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`flex justify-between w-full capitalize ${
                    activeCategory === cat.name
                      ? "text-primary-600 font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  {cat.name}
                  {activeCategory === cat.name && <Check size={16} />}
                </button>
              </li>
            ))}
          </ul>

          {/* Sorting */}
          <div className="mt-8">
            <h3 className="font-bold text-lg mb-3">Sort By</h3>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price Low → High</option>
              <option value="price-desc">Price High → Low</option>
            </select>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonProductCard key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-10 gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="px-4 py-1 border rounded"
                >
                  Prev
                </button>

                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-1 rounded ${
                      page === i + 1 ? "bg-primary-600 text-white" : "border"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === pages}
                  onClick={() => handlePageChange(page + 1)}
                  className="px-4 py-1 border rounded"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Filter size={40} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold">No products found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
