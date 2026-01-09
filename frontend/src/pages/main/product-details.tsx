import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { ShoppingCart, Minus, Plus, Share2, ArrowLeft, Check } from "lucide-react";
import useCart from "@/hooks/useCart";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  priceValue: number;
  image: string;
  images?: string[];
  isNew?: boolean;
  description?: string;
  sizes?: string[];
  colors?: string[];
}

// Mock product data - in real app, this would come from API
const allProducts: Product[] = [
  {
    id: 1,
    name: "Classic Street Tee",
    category: "T-Shirts",
    price: "₦25,000",
    priceValue: 25000,
    image: "/product-1.jpg",
    images: ["/product-1.jpg", "/product-1-alt.jpg", "/product-1-back.jpg"],
    isNew: true,
    description: "Our signature street tee crafted from premium cotton blend. Features a relaxed fit with a modern streetwear aesthetic. Perfect for everyday wear and layering.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Gray", "Navy"],
  },
  {
    id: 2,
    name: "Urban Denim Jacket",
    category: "Jackets",
    price: "₦65,000",
    priceValue: 65000,
    image: "/product-2.jpg",
    images: ["/product-2.jpg", "/product-2-alt.jpg"],
    description: "Premium denim jacket with a classic fit. Features quality construction and timeless design that pairs perfectly with any streetwear ensemble.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black"],
  },
  {
    id: 3,
    name: "Essential Hoodie",
    category: "Hoodies",
    price: "₦40,000",
    priceValue: 40000,
    image: "/product-3.jpg",
    images: ["/product-3.jpg", "/product-3-alt.jpg"],
    isNew: true,
    description: "Comfortable and stylish hoodie made from soft cotton blend. Features a relaxed fit, adjustable drawstring hood, and front kangaroo pocket.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Navy"],
  },
  {
    id: 4,
    name: "Signature Cargo Pants",
    category: "Pants",
    price: "₦45,000",
    priceValue: 45000,
    image: "/product-4.jpg",
    images: ["/product-4.jpg"],
    description: "Functional cargo pants with multiple pockets. Made from durable fabric with a modern streetwear silhouette.",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Black", "Olive", "Khaki"],
  },
  {
    id: 5,
    name: "Oversized Crewneck",
    category: "Sweatshirts",
    price: "₦35,000",
    priceValue: 35000,
    image: "/product-5.jpg",
    images: ["/product-5.jpg"],
    isNew: true,
    description: "Oversized crewneck sweatshirt with a relaxed fit. Perfect for layering or wearing alone.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Gray", "Black", "White"],
  },
  {
    id: 6,
    name: "Vintage Baseball Cap",
    category: "Accessories",
    price: "₦18,000",
    priceValue: 18000,
    image: "/product-6.jpg",
    images: ["/product-6.jpg"],
    description: "Classic baseball cap with adjustable strap. Features embroidered logo and premium construction.",
    sizes: ["One Size"],
    colors: ["Black", "Navy", "Red"],
  },
  {
    id: 7,
    name: "Street Joggers",
    category: "Pants",
    price: "₦48,000",
    priceValue: 48000,
    image: "/product-7.jpg",
    images: ["/product-7.jpg"],
    description: "Comfortable joggers with tapered fit. Perfect for both casual wear and active lifestyle.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Navy"],
  },
  {
    id: 8,
    name: "Bomber Jacket",
    category: "Jackets",
    price: "₦75,000",
    priceValue: 75000,
    image: "/product-8.jpg",
    images: ["/product-8.jpg"],
    isNew: true,
    description: "Stylish bomber jacket with ribbed cuffs and hem. Features a modern streetwear design with quality materials.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Olive", "Navy"],
  },
];

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "details" | "shipping">("description");
  const [addedToCart, setAddedToCart] = useState(false);

  const product = allProducts.find((p) => p.id === Number(id));

  useEffect(() => {
    if (product) {
      // Set default selections
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product]);

  if (!product) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background py-16 text-center">
          <h1 className="text-2xl font-bold text-main mb-4">Product Not Found</h1>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </MainLayout>
    );
  }

  const productImages = product.images || [product.image];
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert("Please select a size");
      return;
    }
    addToCart(product, quantity, selectedSize || undefined, selectedColor || undefined);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + change)));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} - ${product.price}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="main">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted hover:text-main mb-6 transition-colors font-space uppercase text-sm"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Image Gallery */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-square bg-secondary mb-4 overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500"
                  style={{
                    backgroundImage: `url('${productImages[selectedImage]}')`,
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-muted text-sm font-space uppercase">
                      {product.name}
                    </span>
                  </div>
                </div>
                {product.isNew && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white text-black text-xs font-space font-semibold uppercase tracking-wider">
                    New
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-secondary overflow-hidden border-2 transition-all ${
                        selectedImage === index ? "border-main" : "border-transparent"
                      }`}
                    >
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${img}')` }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Category & Name */}
              <div className="mb-4">
                <p className="text-sm text-muted font-space uppercase tracking-wider mb-2">
                  {product.category}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-main uppercase font-space mb-4">
                  {product.name}
                </h1>
                <p className="text-2xl md:text-3xl font-bold text-main font-space">
                  {product.price}
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-muted mb-6 leading-relaxed">{product.description}</p>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-main uppercase font-space mb-3">
                    Size: {selectedSize || "Select Size"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border-2 font-space uppercase text-sm transition-all ${
                          selectedSize === size
                            ? "border-main bg-main text-background"
                            : "border-line text-main hover:border-main"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-main uppercase font-space mb-3">
                    Color: {selectedColor || "Select Color"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border-2 font-space uppercase text-sm transition-all ${
                          selectedColor === color
                            ? "border-main bg-main text-background"
                            : "border-line text-main hover:border-main"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-main uppercase font-space mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-line">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 hover:bg-secondary transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-6 py-2 font-space font-semibold text-main min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 hover:bg-secondary transition-colors"
                      disabled={quantity >= 10}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 font-space font-semibold uppercase text-sm transition-all duration-300 ${
                    addedToCart
                      ? "bg-green-600 text-white"
                      : "bg-main text-background hover:bg-main/90"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check size={18} />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-line text-main font-space font-semibold uppercase text-sm hover:border-main transition-all"
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>

              {/* Product Info Tabs */}
              <div className="border-t border-line pt-6">
                <div className="flex gap-4 mb-4 border-b border-line">
                  {[
                    { id: "description", label: "Description" },
                    { id: "details", label: "Details" },
                    { id: "shipping", label: "Shipping" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`px-4 py-2 font-space uppercase text-sm transition-colors ${
                        activeTab === tab.id
                          ? "text-main border-b-2 border-main font-semibold"
                          : "text-muted hover:text-main"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="text-muted text-sm leading-relaxed">
                  {activeTab === "description" && (
                    <div>
                      <p className="mb-4">{product.description || "No description available."}</p>
                      <p>
                        Made with premium materials and attention to detail. This piece is part of our
                        curated collection designed for those who appreciate quality streetwear.
                      </p>
                    </div>
                  )}
                  {activeTab === "details" && (
                    <div className="space-y-2">
                      <p><strong>Material:</strong> Premium Cotton Blend</p>
                      <p><strong>Care:</strong> Machine wash cold, tumble dry low</p>
                      <p><strong>Origin:</strong> Made with care</p>
                      <p><strong>SKU:</strong> DRI-{product.id.toString().padStart(3, "0")}</p>
                    </div>
                  )}
                  {activeTab === "shipping" && (
                    <div className="space-y-2">
                      <p><strong>Free Shipping:</strong> On orders over ₦50,000</p>
                      <p><strong>Standard Delivery:</strong> 3-5 business days</p>
                      <p><strong>Express Delivery:</strong> 1-2 business days (additional fee)</p>
                      <p><strong>Returns:</strong> 30-day return policy</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-line pt-12">
              <h2 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/shop/${relatedProduct.id}`}
                    className="group"
                  >
                    <div className="relative aspect-[3/4] bg-secondary mb-4 overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                          backgroundImage: `url('${relatedProduct.image}')`,
                        }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-muted text-xs font-space uppercase text-center">
                            {relatedProduct.name}
                          </span>
                        </div>
                      </div>
                      {relatedProduct.isNew && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-white text-black text-xs font-space font-semibold uppercase">
                          New
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted font-space uppercase">{relatedProduct.category}</p>
                      <h3 className="text-sm font-semibold text-main">{relatedProduct.name}</h3>
                      <p className="text-base font-bold text-main font-space">{relatedProduct.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
