import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export const useGenres = () => {
  const { data } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const response = await api.get("/genres");
      return Array.isArray(response.data?.data) ? response.data.data : [];
    },
  });

  return data ?? [];
};
