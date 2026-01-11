import { useQuery } from "@tanstack/react-query";
import api from "@/config/api";
import { toast } from "sonner";
import type { AxiosError } from "axios";

interface UserResponse {
  success: boolean;
  message: string;
  user?: IUser;
  users?: IUser[];
  count?: number;
}

export default function useUser() {

  // Get all users (admin only)
  const getAllUsers = async (): Promise<IUser[]> => {
    try {
      const response = await api.get<UserResponse>("/v1/user/users");

      if (response.data.success) {
        return response.data.users || [];
      }
      return [];
    } catch (error: unknown) {
      const errorMessage =
        (error as unknown as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Failed to fetch users";
      toast.error(errorMessage);
      return [];
    }
  };

  // Get user by ID
  const getUserById = async (userId: string): Promise<IUser> => {
    try {
      const response = await api.get<UserResponse>(`/v1/user/users/${userId}`);

      if (response.data.success && response.data.user) {
        return response.data.user;
      }
      throw new Error("User not found");
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Failed to fetch user";
      toast.error(errorMessage);
      throw error;
    }
  };

  // React Query hooks
  const useAllUsers = () => {
    return useQuery({
      queryKey: ["users", "all"],
      queryFn: () => getAllUsers(),
    });
  };

  const useUser = (userId: string) => {
    return useQuery({
      queryKey: ["user", userId],
      queryFn: () => getUserById(userId),
      enabled: !!userId,
    });
  };

  return {
    getAllUsers,
    getUserById,
    useAllUsers,
    useUser,
  };
}

