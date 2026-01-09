import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  isNew?: boolean;
}

const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Classic Street Tee",
    category: "T-Shirts",
    price: "₦25,000",
    image: "/product-1.jpg",
    isNew: true,
  },
  {
    id: 2,
    name: "Urban Denim Jacket",
    category: "Jackets",
    price: "₦65,000",
    image: "/product-2.jpg",
  },
  {
    id: 3,
    name: "Essential Hoodie",
    category: "Hoodies",
    price: "₦40,000",
    image: "/product-3.jpg",
    isNew: true,
  },
  {
    id: 4,
    name: "Signature Cargo Pants",
    category: "Pants",
    price: "₦45,000",
    image: "/product-4.jpg",
  },
  {
    id: 5,
    name: "Oversized Crewneck",
    category: "Sweatshirts",
    price: "₦35,000",
    image: "/product-5.jpg",
    isNew: true,
  },
  {
    id: 6,
    name: "Vintage Baseball Cap",
    category: "Accessories",
    price: "₦18,000",
    image: "/product-6.jpg",
  },
  {
    id: 7,
    name: "Street Joggers",
    category: "Pants",
    price: "₦48,000",
    image: "/product-7.jpg",
  },
  {
    id: 8,
    name: "Bomber Jacket",
    category: "Jackets",
    price: "₦75,000",
    image: "/product-8.jpg",
    isNew: true,
  },
];

export default function Featured() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="main">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full mb-4">
            <span className="text-xs md:text-sm font-space uppercase tracking-wider text-main">
              Featured Collection
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-main uppercase font-space mb-4">
            Shop The Latest
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-sm md:text-base">
            Discover our curated selection of streetwear essentials designed for the modern lifestyle.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Image Container */}
              <div className="relative overflow-hidden bg-secondary aspect-[3/4] mb-4">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url('${product.image}')`,
                  }}
                >
                  {/* Placeholder if image doesn't exist */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-muted md:text-sm text-xs text-wrap text-center font-space uppercase">
                      {product.name}
                    </span>
                  </div>
                </div>

                {/* New Badge */}
                {product.isNew && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white text-black text-xs font-space font-semibold uppercase tracking-wider">
                    New
                  </div>
                )}


                {/* Quick View Overlay */}
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
              <div className="space-y-1">
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

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-space font-semibold uppercase tracking-wider text-sm hover:bg-black/90 transition-all duration-300"
          >
            <span>View All Products</span>
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

