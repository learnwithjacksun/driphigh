import { v2 as cloudinary } from "cloudinary";
import envFile from "../config/env.js";


cloudinary.config({
  cloud_name: envFile.CLOUDINARY_CLOUD_NAME,
  api_key: envFile.CLOUDINARY_API_KEY,
  api_secret: envFile.CLOUDINARY_API_SECRET,
});


const uploadImage = async (file) => {
  try {
    // Handle base64 strings - Cloudinary accepts data URIs directly
    // Cloudinary can handle:
    // 1. Data URIs: data:image/png;base64,<base64_string>
    // 2. Plain base64 strings (but data URI is preferred)
    let uploadData = file;
    
    // If it's a base64 string without data URI prefix, Cloudinary might still handle it
    // But data URI format is more reliable
    if (typeof file === "string" && !file.startsWith("data:") && !file.startsWith("http")) {
      // For plain base64 strings, Cloudinary should handle them
      // But we'll try to upload as-is first
      uploadData = file;
    }

    const uploadOptions = {
      resource_type: "image",
      folder: "driphigh-images",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    const result = await cloudinary.uploader.upload(uploadData, uploadOptions);

    // Ensure we have a valid secure_url
    if (!result || !result.secure_url) {
      throw new Error("Cloudinary upload succeeded but no secure_url returned");
    }

    console.log("Cloudinary upload successful:", {
      public_id: result.public_id,
      secure_url: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
    });

    return {
      imageUrl: result.secure_url,
      publicIdImage: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error details:", {
      message: error.message,
      http_code: error.http_code,
      name: error.name,
    });
    throw new Error(error.message || "Failed to upload image");
  }
};


const deleteImage = async (publicIdImage) => {
  const imageDelete = await cloudinary.uploader.destroy(publicIdImage);

  return {
    imageDelete,
  };
};

export { uploadImage, deleteImage };
