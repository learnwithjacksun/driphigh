import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { Search, X, SlidersHorizontal, Grid3x3, List } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  priceValue: number; // For sorting/filtering
  image: string;
  isNew?: boolean;
}

const allProducts: Product[] = [
  {
    id: 1,
    name: "Classic Street Tee",
    category: "T-Shirts",
    price: "₦25,000",
    priceValue: 25000,
    image: "/product-1.jpg",
    isNew: true,
  },
  {
    id: 2,
    name: "Urban Denim Jacket",
    category: "Jackets",
    price: "₦65,000",
    priceValue: 65000,
    image: "/product-2.jpg",
  },
  {
    id: 3,
    name: "Essential Hoodie",
    category: "Hoodies",
    price: "₦40,000",
    priceValue: 40000,
    image: "/product-3.jpg",
    isNew: true,
  },
  {
    id: 4,
    name: "Signature Cargo Pants",
    category: "Pants",
    price: "₦45,000",
    priceValue: 45000,
    image: "/product-4.jpg",
  },
  {
    id: 5,
    name: "Oversized Crewneck",
    category: "Sweatshirts",
    price: "₦35,000",
    priceValue: 35000,
    image: "/product-5.jpg",
    isNew: true,
  },
  {
    id: 6,
    name: "Vintage Baseball Cap",
    category: "Accessories",
    price: "₦18,000",
    priceValue: 18000,
    image: "/product-6.jpg",
  },
  {
    id: 7,
    name: "Street Joggers",
    category: "Pants",
    price: "₦48,000",
    priceValue: 48000,
    image: "/product-7.jpg",
  },
  {
    id: 8,
    name: "Bomber Jacket",
    category: "Jackets",
    price: "₦75,000",
    priceValue: 75000,
    image: "/product-8.jpg",
    isNew: true,
  },
  {
    id: 9,
    name: "Graphic Print Tee",
    category: "T-Shirts",
    price: "₦28,000",
    priceValue: 28000,
    image: "/product-9.jpg",
  },
  {
    id: 10,
    name: "Zip-Up Hoodie",
    category: "Hoodies",
    price: "₦42,000",
    priceValue: 42000,
    image: "/product-10.jpg",
  },
  {
    id: 11,
    name: "Cargo Shorts",
    category: "Pants",
    price: "₦38,000",
    priceValue: 38000,
    image: "/product-11.jpg",
  },
  {
    id: 12,
    name: "Leather Jacket",
    category: "Jackets",
    price: "₦95,000",
    priceValue: 95000,
    image: "/product-12.jpg",
  },
];

const categories = ["All", "T-Shirts", "Jackets", "Hoodies", "Pants", "Sweatshirts", "Accessories"];

type SortOption = "default" | "price-low" | "price-high" | "name-asc" | "name-desc";

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesPrice = product.priceValue >= priceRange.min && product.priceValue <= priceRange.max;
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "price-high":
        filtered.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setPriceRange({ min: 0, max: 200000 });
    setSortBy("default");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "All" || priceRange.min > 0 || priceRange.max < 200000;

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="main">
          {/* Page Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-main uppercase font-space mb-4">
              Shop
            </h1>
            <p className="text-muted text-sm md:text-base">
              Discover our complete collection of streetwear essentials
            </p>
          </div>

          {/* Search and Controls Bar */}
          <div className="mb-6 md:mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-line bg-background text-main font-space focus:outline-none focus:border-main transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted hover:text-main"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Filter Toggle & Category Filter */}
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-line bg-background hover:bg-secondary transition-colors font-space uppercase text-sm"
                >
                  <SlidersHorizontal size={18} />
                  <span>Filters</span>
                </button>

                {/* Category Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 font-space uppercase text-sm transition-colors ${
                        selectedCategory === category
                          ? "bg-main text-background"
                          : "bg-secondary text-main hover:bg-secondary/80"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort & View Mode */}
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2 border border-line bg-background text-main font-space focus:outline-none focus:border-main transition-colors text-sm"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>

                <div className="flex items-center gap-2 border border-line">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${
                      viewMode === "grid" ? "bg-main text-background" : "bg-background text-main hover:bg-secondary"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3x3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${
                      viewMode === "list" ? "bg-main text-background" : "bg-background text-main hover:bg-secondary"
                    }`}
                    aria-label="List view"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Indicator */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted">Active filters:</span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-secondary text-main text-sm font-space">
                    Search: {searchQuery}
                  </span>
                )}
                {selectedCategory !== "All" && (
                  <span className="px-3 py-1 bg-secondary text-main text-sm font-space">
                    Category: {selectedCategory}
                  </span>
                )}
                {(priceRange.min > 0 || priceRange.max < 200000) && (
                  <span className="px-3 py-1 bg-secondary text-main text-sm font-space">
                    Price: ₦{priceRange.min.toLocaleString()} - ₦{priceRange.max.toLocaleString()}
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 bg-main text-background text-sm font-space uppercase hover:bg-main/90 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <aside
              className={`${
                showFilters ? "block" : "hidden"
              } md:block w-full md:w-64 flex-shrink-0 space-y-6 mb-8 md:mb-0`}
            >
              <div className="bg-secondary p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-main uppercase font-space">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="md:hidden text-muted hover:text-main"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-semibold text-main uppercase font-space mb-3">
                    Price Range
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted mb-1 block">Min: ₦{priceRange.min.toLocaleString()}</label>
                      <input
                        type="range"
                        min="0"
                        max="200000"
                        step="5000"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted mb-1 block">Max: ₦{priceRange.max.toLocaleString()}</label>
                      <input
                        type="range"
                        min="0"
                        max="200000"
                        step="5000"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Price Filters */}
                <div>
                  <h4 className="text-sm font-semibold text-main uppercase font-space mb-3">
                    Quick Filters
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setPriceRange({ min: 0, max: 30000 })}
                      className="w-full text-left px-3 py-2 bg-background hover:bg-background/80 text-main text-sm font-space transition-colors"
                    >
                      Under ₦30,000
                    </button>
                    <button
                      onClick={() => setPriceRange({ min: 30000, max: 50000 })}
                      className="w-full text-left px-3 py-2 bg-background hover:bg-background/80 text-main text-sm font-space transition-colors"
                    >
                      ₦30,000 - ₦50,000
                    </button>
                    <button
                      onClick={() => setPriceRange({ min: 50000, max: 200000 })}
                      className="w-full text-left px-3 py-2 bg-background hover:bg-background/80 text-main text-sm font-space transition-colors"
                    >
                      Over ₦50,000
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid/List */}
            <div className="flex-1">
              <div className="mb-4">
                <p className="text-sm text-muted">
                  Showing {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? "s" : ""}
                </p>
              </div>

              {filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted text-lg mb-4">No products found</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                      : "space-y-6"
                  }
                >
                  {filteredAndSortedProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`group relative ${
                        viewMode === "list" ? "flex gap-6" : ""
                      }`}
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      {/* Product Image */}
                      <div
                        className={`relative overflow-hidden bg-secondary ${
                          viewMode === "list" ? "w-48 h-64 flex-shrink-0" : "aspect-[3/4] mb-4"
                        }`}
                      >
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{
                            backgroundImage: `url('${product.image}')`,
                          }}
                        >
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <span className="text-muted md:text-sm text-xs text-wrap text-center font-space uppercase">
                              {product.name}
                            </span>
                          </div>
                        </div>

                        {product.isNew && (
                          <div className="absolute top-4 left-4 px-3 py-1 bg-white text-black text-xs font-space font-semibold uppercase tracking-wider">
                            New
                          </div>
                        )}


                        <div
                          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                            hoveredProduct === product.id ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <Link
                            to={`/shop/${product.id}`}
                            className="px-6 py-3 bg-white text-black font-space font-semibold uppercase text-sm tracking-wider hover:bg-white/90 transition-colors duration-300"
                          >
                            Quick View
                          </Link>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className={`space-y-1 ${viewMode === "list" ? "flex-1" : ""}`}>
                        <p className="text-xs text-muted font-space uppercase tracking-wider">
                          {product.category}
                        </p>
                        <h3 className="text-sm md:text-lg font-semibold text-main">
                          {product.name}
                        </h3>
                        <p className="text-lg font-bold text-main font-space">
                          {product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
