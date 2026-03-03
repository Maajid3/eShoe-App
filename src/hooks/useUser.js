import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";

const fetchProfile = async () => {
  const res = await apiClient.get("profile/");
  return res.data;
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchProfile,
    retry: 2,
  });
};
