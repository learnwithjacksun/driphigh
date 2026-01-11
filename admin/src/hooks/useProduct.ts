import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/config/api";
import { useState } from "react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

interface ProductResponse {
  success: boolean;
  message: string;
  product?: IProduct;
  products?: IProduct[];
  count?: number;
}

interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
}

export default function useProduct() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Get all products
  const getAllProducts = async (category?: string, search?: string): Promise<IProduct[]> => {
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (search) params.append("search", search);

      const response = await api.get<ProductResponse>(
        `/v1/products${params.toString() ? `?${params.toString()}` : ""}`
      );

      if (response.data.success) {
        return response.data.products || [];
      }
      return [];
    } catch (error: unknown) {
      const errorMessage =
        (error as unknown as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Failed to fetch products";
      toast.error(errorMessage);
      return [];
    }
  };

  // Get product by ID
  const getProductById = async (productId: string): Promise<IProduct> => {
    try {
      const response = await api.get<ProductResponse>(`/v1/products/${productId}`);

      if (response.data.success && response.data.product) {
        return response.data.product;
      }
      throw new Error("Product not found");
    } catch (error: unknown) {
      const errorMessage =
        (error as unknown as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Failed to fetch product";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Create product (admin only)
  const createProduct = async (productData: CreateProductData): Promise<IProduct | undefined> => {
    setLoading(true);
    try {
      const response = await api.post<ProductResponse>("/v1/products", productData);

      if (response.data.success && response.data.product) {
        toast.success("Product created successfully");
        queryClient.invalidateQueries({ queryKey: ["products"] });
        return response.data.product;
      }
      throw new Error("Failed to create product");
    } catch (error: unknown) {
      const errorMessage =
        (error as unknown as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Failed to create product";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update product (admin only)
  const updateProduct = async (
    productId: string,
    productData: Partial<CreateProductData>
  ): Promise<IProduct | undefined> => {
    setLoading(true);
    try {
      const response = await api.patch<ProductResponse>(`/v1/products/${productId}`, productData);

      if (response.data.success && response.data.product) {
        toast.success("Product updated successfully");
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["product", productId] });
        return response.data.product;
      }
      throw new Error("Failed to update product");
    } catch (error: unknown) {
      const errorMessage =
        (error as unknown as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Failed to update product";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete product (admin only)
  const deleteProduct = async (productId: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await api.delete<ProductResponse>(`/v1/products/${productId}`);

      if (response.data.success) {
        toast.success("Product deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["products"] });
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as unknown as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Failed to delete product";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // React Query hooks
  const useAllProducts = (category?: string, search?: string) => {
    return useQuery({
      queryKey: ["products", category, search],
      queryFn: () => getAllProducts(category, search),
    });
  };

  const useProduct = (productId: string) => {
    return useQuery({
      queryKey: ["product", productId],
      queryFn: () => getProductById(productId),
      enabled: !!productId,
    });
  };

  return {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    useAllProducts,
    useProduct,
    loading,
  };
}

