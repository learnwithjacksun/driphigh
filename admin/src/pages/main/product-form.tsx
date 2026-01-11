import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts";
import {
  ArrowLeft,
  X,
  Plus,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import useProduct from "@/hooks/useProduct";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { ButtonWithLoader } from "@/components/ui";
import { toBase64 } from "@/helpers/toBase64String";

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const {
    useProduct: useProductQuery,
    createProduct,
    updateProduct,
    loading,
  } = useProduct();

  const { data: existingProduct, isLoading } = useProductQuery(id || "");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    sizes: [] as string[],
    colors: [] as string[],
    images: [] as string[],
  });

  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [imageInputs, setImageInputs] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([]);

  // Available categories
  const categories = [
    "T-Shirts",
    "Jackets",
    "Hoodies",
    "Pants",
    "Sweatshirts",
    "Accessories",
    "Dresses",
    "Shorts",
    "Shoes",
  ];

  // Available sizes
  const availableSizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL",
    "28",
    "30",
    "32",
    "34",
    "36",
    "38",
    "40",
    "42",
    "44",
  ];

  useEffect(() => {
    if (isEditMode && existingProduct) {
      setFormData({
        name: existingProduct.name || "",
        description: existingProduct.description || "",
        price: existingProduct.price?.toString() || "",
        category: existingProduct.category || "",
        sizes: existingProduct.sizes || [],
        colors: existingProduct.colors || [],
        images: existingProduct.images || [],
      });
      const existingImages = existingProduct.images || [];
      setImageInputs(existingImages);
      setUploadingImages(new Array(existingImages.length).fill(false));
    } else if (!isEditMode) {
      // Initialize with empty image inputs for new products
      setImageInputs([]);
      setUploadingImages([]);
    }
  }, [existingProduct, isEditMode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSizeSelect = (size: string) => {
    if (formData.sizes.includes(size)) {
      // Remove if already selected
      setFormData((prev) => ({
        ...prev,
        sizes: prev.sizes.filter((s) => s !== size),
      }));
    } else {
      // Add if not selected
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, size],
      }));
    }
  };

  const handleAddSize = () => {
    if (sizeInput.trim() && !formData.sizes.includes(sizeInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, sizeInput.trim()],
      }));
      setSizeInput("");
    }
  };

  const handleRemoveSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== size),
    }));
  };

  const handleAddColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()],
      }));
      setColorInput("");
    }
  };

  const handleRemoveColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...imageInputs];
    newImages[index] = value;
    setImageInputs(newImages);
    setFormData((prev) => ({
      ...prev,
      images: newImages.filter((img) => img.trim()),
    }));
  };

  const handleMultipleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    // Validate all files first
    fileArray.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        invalidFiles.push(`${file.name} is not an image file`);
      } else if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} is larger than 5MB`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error(`Some files were invalid: ${invalidFiles.join(", ")}`);
    }

    if (validFiles.length === 0) {
      return;
    }

    // Set uploading state for all new images
    const currentLength = imageInputs.length;
    const newUploading = [...uploadingImages, ...new Array(validFiles.length).fill(true)];
    setUploadingImages(newUploading);

    try {
      const newImages = [...imageInputs];
      const base64Promises = validFiles.map((file) => toBase64(file));

      const base64Strings = await Promise.all(base64Promises);

      // Add new images to the array
      base64Strings.forEach((base64String: string) => {
        newImages.push(base64String);
      });

      setImageInputs(newImages);
      setFormData((prev) => ({ ...prev, images: newImages.filter((img) => img.trim()) }));

      toast.success(`${validFiles.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload some images. Please try again.");
    } finally {
      // Reset uploading states
      const finalUploading = [...uploadingImages];
      finalUploading.splice(currentLength, validFiles.length, ...new Array(validFiles.length).fill(false));
      setUploadingImages(finalUploading);
    }
  };

  const handleMultipleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleMultipleFileUpload(files);
    }
    // Reset input
    e.target.value = "";
  };
 

 

  const handleRemoveImage = (index: number) => {
    const newImages = imageInputs.filter((_, i) => i !== index);
    const newUploading = uploadingImages.filter((_, i) => i !== index);
    setImageInputs(newImages);
    setUploadingImages(newUploading);
    setFormData((prev) => ({
      ...prev,
      images: newImages.filter((img) => img.trim()),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.sizes.length === 0) {
      toast.error("Please add at least one size");
      return;
    }

    if (formData.colors.length === 0) {
      toast.error("Please add at least one color");
      return;
    }

    if (formData.images.filter((img) => img.trim()).length === 0) {
      toast.error("Please add at least one image (upload file or paste URL)");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description || undefined,
      price: price,
      category: formData.category,
      sizes: formData.sizes,
      colors: formData.colors,
      images: formData.images.filter((img) => img.trim()),
    };

    try {
      if (isEditMode && id) {
        await updateProduct(id, productData);
        navigate("/products");
      } else {
        await createProduct(productData);
        navigate("/products");
      }
    } catch (error: unknown) {
      toast.error(
        (error as unknown as AxiosError<{ message?: string }>)?.response?.data
          ?.message || "Failed to save product"
      );
      throw error;
    }
  };

  if (isEditMode && isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background py-8 md:py-12">
          <div className="main">
            <p className="text-muted">Loading product...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="main max-w-4xl">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-muted hover:text-main mb-6 transition-colors font-space uppercase text-sm"
          >
            <ArrowLeft size={18} />
            <span>Back to Products</span>
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-8">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-secondary p-6 md:p-8 border border-line"
          >
            {/* Basic Information */}
            <div className="space-y-6 mb-8">
              

              <div>
                <label className="block text-sm font-semibold text-main uppercase font-space mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors font-space"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-main uppercase font-space mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors font-space"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-main uppercase font-space mb-2">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="w-full px-4 py-3 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors font-space"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-main uppercase font-space mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors font-space"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-4 mb-8">
              <h2 className="text-sm font-semibold text-main uppercase font-space mb-4">
                Sizes *
              </h2>
              <div className="space-y-3">
                {/* Size Selection Grid */}
                <div>
                  <label className="block text-xs text-muted font-space uppercase mb-2">
                    Select Available Sizes
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeSelect(size)}
                        className={`px-3 py-2 border-2 font-space uppercase text-sm transition-all ${
                          formData.sizes.includes(size)
                            ? "border-main bg-main text-background"
                            : "border-line text-main hover:border-main"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Custom Size Input (Optional) */}
                <div>
                  <label className="block text-xs text-muted font-space uppercase mb-2">
                    Or Add Custom Size
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSize();
                        }
                      }}
                      placeholder="Enter custom size"
                      className="flex-1 px-4 py-3 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors font-space"
                    />
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="px-6 py-3 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                {/* Selected Sizes Display */}
                {formData.sizes.length > 0 && (
                  <div>
                    <p className="text-xs text-muted font-space uppercase mb-2">
                      Selected Sizes:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.sizes.map((size) => (
                        <span
                          key={size}
                          className="px-3 py-1 bg-background border border-line text-main font-space flex items-center gap-2"
                        >
                          {size}
                          <button
                            type="button"
                            onClick={() => handleRemoveSize(size)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4 mb-8">
              <h2 className="text-sm font-semibold text-main uppercase font-space mb-4">
                Colors *
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddColor();
                    }
                  }}
                  placeholder="Add color (e.g., Red, Blue, Black)"
                  className="flex-1 px-4 py-3 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors font-space"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-6 py-3 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors.map((color) => (
                  <span
                    key={color}
                    className="px-3 py-1 bg-background border border-line text-main font-space flex items-center gap-2"
                  >
                    {color}
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(color)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4 mb-8">
              <div className="space-y-2">
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold text-main uppercase font-space">
                    Images *
                  </h2>
            
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleFileInputChange}
                      className="hidden"
                      id="multi-file-input"
                    />
                   
                   
                 
                <p className="text-xs text-muted">
                  Upload multiple images at once.  <br />
                </p>
                </div>
              </div>
              {/* Images Grid */}
              {formData.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imageInputs.map((image, index) => {
                    if (!image || !image.trim()) return null;
                    const isValidImage =
                      image.startsWith("data:") ||
                      image.startsWith("http://") ||
                      image.startsWith("https://");

                    return (
                      <div key={index} className="relative group">
                        {isValidImage ? (
                          <div className="relative aspect-square border-2 border-line overflow-hidden bg-secondary rounded-lg">
                            <img
                              src={image}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                            {/* Remove button overlay */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              title="Remove image"
                            >
                              <X size={16} />
                            </button>
                            {/* Uploading indicator */}
                            {uploadingImages[index] && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="relative aspect-square border-2 border-line bg-secondary rounded-lg flex items-center justify-center">
                            <div className="text-center p-2">
                              <ImageIcon
                                size={24}
                                className="mx-auto mb-2 text-muted"
                              />
                              <p className="text-xs text-muted">
                                Invalid image
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              title="Remove"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="border-2 border-dashed border-line rounded-lg p-12 text-center">
                  <ImageIcon size={48} className="mx-auto mb-4 text-muted" />
                  <p className="text-muted mb-4">No images added yet</p>
                  <label
                    htmlFor="multi-file-input"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors cursor-pointer"
                  >
                    <Upload size={18} />
                    <span>Upload Images</span>
                  </label>
                </div>
              )}

              {/* URL Input Fields (for adding URLs) */}
              {imageInputs.some(
                (img) =>
                  !img ||
                  (!img.startsWith("data:") &&
                    !img.startsWith("http://") &&
                    !img.startsWith("https://"))
              ) && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-semibold text-main uppercase font-space">
                    Image URLs:
                  </p>
                  {imageInputs.map((image, index) => {
                    if (
                      image &&
                      (image.startsWith("data:") ||
                        image.startsWith("http://") ||
                        image.startsWith("https://"))
                    ) {
                      return null;
                    }
                    return (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={image || ""}
                          onChange={(e) =>
                            handleImageChange(index, e.target.value)
                          }
                          placeholder={`Image URL ${index + 1}`}
                          className="flex-1 px-4 py-3 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors font-space"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (image && image.trim()) {
                              // Convert URL to base64
                              const img = new Image();
                              img.crossOrigin = "anonymous";
                              img.onload = () => {
                                const canvas = document.createElement("canvas");
                                canvas.width = img.width;
                                canvas.height = img.height;
                                const ctx = canvas.getContext("2d");
                                if (ctx) {
                                  ctx.drawImage(img, 0, 0);
                                  const base64 = canvas.toDataURL("image/png");
                                  handleImageChange(index, base64);
                                  toast.success(
                                    "Image URL converted to base64"
                                  );
                                }
                              };
                              img.onerror = () => {
                                toast.error("Failed to load image from URL");
                              };
                              img.src = image;
                            }
                          }}
                          disabled={!image || !image.trim()}
                          className="px-4 py-3 border border-main text-main font-space font-semibold uppercase text-sm hover:bg-main hover:text-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Convert
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="px-4 py-3 border border-red-500 text-red-500 font-space font-semibold uppercase text-sm hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="w-full">
              <ButtonWithLoader
                loading={loading}
                initialText={isEditMode ? "Update Product" : "Create Product"}
                loadingText="Saving..."
                type="submit"
                disabled={loading}
                className="w-full gap-2 px-8 py-4 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
