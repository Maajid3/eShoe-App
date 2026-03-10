import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/apiClient";

const cartFetch = async () => {
  const res = await apiClient.get("carts/");
  return res.data.results ?? res.data;
};

export const useCart = () => {
  const token = localStorage.getItem("access");
  return useQuery({
    queryKey: ["cart"],
    queryFn: cartFetch,
    enabled: !!token,
  });
};

//  add cart

const addItemCart = async (cartData) => {
  const response = await apiClient.post("carts-items/", cartData);
  return response.data;
};

export const useAddCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addItemCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.log("error adding");
    },
  });
};

// increase decrease quantity

const updateCartQuantity = async ({ id, quantity }) => {
  const response = await apiClient.patch(`carts-items/${id}/`, { quantity });
  return response.data;
};

export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCartQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      console.log("Success item decreased✅");
    },
    onError: () => {
      console.log("Error decreasing item❌");
    },
  });
};

// remove item

const removeItem = async ({ id }) => {
  const response = await apiClient.delete(`carts-items/${id}/`, { id });
  return response.data;
};

export const useRemoveItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      console.log("deleted successfully✅");
    },
    onError: () => {
      console.log("erorr deleting ❌");
    },
  });
};

// clear entire cart after order
const clearCartItems = async (items) => {
  await Promise.all(
    items.map((item) => apiClient.delete(`carts-items/${item.id}/`)),
  );
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCartItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
