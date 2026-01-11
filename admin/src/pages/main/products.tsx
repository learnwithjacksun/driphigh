import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { Package, Plus, Edit, Trash2, Search, ArrowLeft } from "lucide-react";
import useProduct from "@/hooks/useProduct";
import { useState } from "react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export default function Products() {
  const navigate = useNavigate();
  const { useAllProducts, deleteProduct, loading } = useProduct();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

  const { data: products = [], isLoading } = useAllProducts(
    categoryFilter === "all" ? undefined : categoryFilter,
    searchTerm || undefined
  );

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error: unknown) {
      toast.error((error as unknown as AxiosError<{ message?: string }>)?.response?.data?.message || "Failed to delete product");
    }
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading || loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background py-8 md:py-12">
          <div className="main">
            <p className="text-muted">Loading products...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="main">
          {/* Header */}
          <div className="mb-8 flex-wrap gap-4 flex md:items-center justify-between">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-muted hover:text-main mb-6 transition-colors font-space uppercase text-sm"
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-2">
                Products Management
              </h1>
              <p className="text-muted text-sm md:text-base">
                Manage all products in the shop
              </p>
            </div>
            <Link
              to="/products/new"
              className="flex items-center gap-2 px-6 py-3 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors"
            >
              <Plus size={18} />
              <span>Add Product</span>
            </Link>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors font-space"
                />
              </div>
            </div>
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-line bg-background text-main font-space focus:outline-none focus:border-main transition-colors text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products List */}
          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center">
                <Package size={48} className="text-muted" />
              </div>
              <h2 className="text-2xl font-bold text-main uppercase font-space mb-4">
                No Products Found
              </h2>
              <p className="text-muted mb-8">
                {searchTerm || categoryFilter !== "all"
                  ? "No products match your search criteria"
                  : "No products added yet"}
              </p>
              <Link
                to="/products/new"
                className="inline-flex items-center gap-2 px-8 py-4 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors"
              >
                <Plus size={18} />
                <span>Add First Product</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-secondary p-6 border border-line hover:border-main/30 transition-all"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-background mb-4 overflow-hidden border border-line relative">
                    {product.images && product.images.length > 0 ? (
                      <>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = "none";
                            const placeholder = img.nextElementSibling as HTMLElement;
                            if (placeholder) {
                              placeholder.style.display = "flex";
                            }
                          }}
                        />
                        {/* Placeholder (hidden by default, shown on error) */}
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 hidden items-center justify-center absolute inset-0">
                          <span className="text-muted text-xs font-space uppercase text-center px-2">
                            {product.name}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <Package size={48} className="text-muted" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-main uppercase font-space mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted font-space uppercase mb-2">{product.category}</p>
                    <p className="text-xl font-bold text-main font-space mb-2">
                      {formatPrice(product.price)}
                    </p>
                    {product.description && (
                      <p className="text-sm text-muted line-clamp-2 mb-2">{product.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs text-muted">
                        Sizes: {product.sizes?.join(", ") || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-muted">
                        Colors: {product.colors?.join(", ") || "N/A"}
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-2">Added: {formatDate(product.createdAt)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/products/${product.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-line text-main font-space font-semibold uppercase text-sm hover:bg-background transition-colors"
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => {
                        setProductToDelete(product);
                        setIsDeleteModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-red-500 text-red-500 font-space font-semibold uppercase text-sm hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background p-6 max-w-md w-full border border-line">
            <h3 className="text-xl font-semibold text-main uppercase font-space mb-4">
              Delete Product
            </h3>
            <p className="text-muted mb-6">
              Are you sure you want to delete "{productToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-line text-main font-space font-semibold uppercase text-sm hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white font-space font-semibold uppercase text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

