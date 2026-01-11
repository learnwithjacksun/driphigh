import ProductModel from "../model/products.js";
import { onError } from "../utils/onError.js";
import { uploadImage } from "../libs/cloudinary.js";

// Create product (admin only)
export const createProduct = async (req, res) => {
  const { name, description, price, category, sizes, colors, images } = req.body;

  try {
    // Validate required fields
    if (!name || !price || !category || !sizes || !colors) {
      return res.status(400).json({
        success: false,
        message: "Name, price, category, sizes, and colors are required",
      });
    }

    // Validate sizes and colors are arrays
    if (!Array.isArray(sizes) || sizes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Sizes must be a non-empty array",
      });
    }

    if (!Array.isArray(colors) || colors.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Colors must be a non-empty array",
      });
    }

    // Validate price is a number
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    // Handle images - can be base64 strings or URLs
    let uploadedImages = [];
    
    if (images && Array.isArray(images) && images.length > 0) {
      // Upload each image to Cloudinary
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        try {
          // If image is already a URL (Cloudinary URL or external URL), use it directly
          if (typeof image === "string" && (image.startsWith("http://") || image.startsWith("https://"))) {
            uploadedImages.push(image);
            console.log(`Image ${i + 1}: Using existing URL - ${image.substring(0, 50)}...`);
          } else if (typeof image === "string") {
            // Handle base64 string (with or without data URI prefix)
            let imageToUpload = image;
            
            // Ensure base64 string has proper format for Cloudinary
            // Cloudinary accepts data URIs like: data:image/png;base64,<base64_string>
            // If it doesn't have the prefix, we'll try to upload it as-is (Cloudinary might handle it)
            if (!imageToUpload.startsWith("data:")) {
              // If it's a plain base64 string, Cloudinary should still handle it
              // But let's log it for debugging
              console.log(`Image ${i + 1}: Uploading base64 string (no data URI prefix)`);
            } else {
              console.log(`Image ${i + 1}: Uploading base64 string with data URI prefix`);
            }
            
            const uploadResult = await uploadImage(imageToUpload);
            
            if (!uploadResult || !uploadResult.imageUrl) {
              throw new Error("Upload succeeded but no image URL returned");
            }
            
            uploadedImages.push(uploadResult.imageUrl);
            console.log(`Image ${i + 1}: Successfully uploaded - ${uploadResult.imageUrl}`);
          } else {
            return res.status(400).json({
              success: false,
              message: "Invalid image format. Images must be URLs or base64 strings",
            });
          }
        } catch (uploadError) {
          console.error(`Error uploading image ${i + 1}:`, uploadError);
          return res.status(500).json({
            success: false,
            message: `Failed to upload image ${i + 1}: ${uploadError.message}`,
          });
        }
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // Verify uploaded images before saving
    console.log("Uploaded images URLs:", uploadedImages);
    
    if (uploadedImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid images were uploaded",
      });
    }

    // Create product
    const product = await ProductModel.create({
      name,
      description: description || "",
      price,
      images: uploadedImages,
      category,
      sizes,
      colors,
    });

    console.log("Product created with images:", product.images);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Get all products (public)
export const getAllProducts = async (req, res) => {
  const { category, search } = req.query;

  try {
    const query = {};

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Search by name if provided
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await ProductModel.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
      count: products.length,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Get single product by ID (public)
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Update product (admin only)
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, sizes, colors, images } = req.body;

  try {
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update fields if provided
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) {
      if (typeof price !== "number" || price <= 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a positive number",
        });
      }
      product.price = price;
    }
    if (category !== undefined) product.category = category;
    if (sizes !== undefined) {
      if (!Array.isArray(sizes) || sizes.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Sizes must be a non-empty array",
        });
      }
      product.sizes = sizes;
    }
    if (colors !== undefined) {
      if (!Array.isArray(colors) || colors.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Colors must be a non-empty array",
        });
      }
      product.colors = colors;
    }

    // Handle images update if provided
    if (images !== undefined && Array.isArray(images) && images.length > 0) {
      let uploadedImages = [];

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        try {
          // If image is already a URL (Cloudinary URL or external URL), use it directly
          if (typeof image === "string" && (image.startsWith("http://") || image.startsWith("https://"))) {
            uploadedImages.push(image);
            console.log(`Update Image ${i + 1}: Using existing URL - ${image.substring(0, 50)}...`);
          } else if (typeof image === "string") {
            // Handle base64 string (with or without data URI prefix)
            let imageToUpload = image;
            
            if (!imageToUpload.startsWith("data:")) {
              console.log(`Update Image ${i + 1}: Uploading base64 string (no data URI prefix)`);
            } else {
              console.log(`Update Image ${i + 1}: Uploading base64 string with data URI prefix`);
            }
            
            const uploadResult = await uploadImage(imageToUpload);
            
            if (!uploadResult || !uploadResult.imageUrl) {
              throw new Error("Upload succeeded but no image URL returned");
            }
            
            uploadedImages.push(uploadResult.imageUrl);
            console.log(`Update Image ${i + 1}: Successfully uploaded - ${uploadResult.imageUrl}`);
          } else {
            return res.status(400).json({
              success: false,
              message: "Invalid image format. Images must be URLs or base64 strings",
            });
          }
        } catch (uploadError) {
          console.error(`Error uploading update image ${i + 1}:`, uploadError);
          return res.status(500).json({
            success: false,
            message: `Failed to upload image ${i + 1}: ${uploadError.message}`,
          });
        }
      }

      // Verify uploaded images before saving
      console.log("Updated images URLs:", uploadedImages);
      
      if (uploadedImages.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid images were uploaded",
        });
      }

      product.images = uploadedImages;
    }

    await product.save();

    console.log("Product updated with images:", product.images);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    onError(res, error);
  }
};

// Delete product (admin only)
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Optionally delete images from Cloudinary
    // Note: This would require storing public_id, which we're not currently doing
    // For now, we'll just delete from database
    // If you want to delete from Cloudinary, you'd need to store public_id in the model

    await ProductModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    onError(res, error);
  }
};

