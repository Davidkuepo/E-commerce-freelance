import { ProduitRestController } from "@/services/main";
import { useQuery } from "@tanstack/react-query";

export const useProductListClient = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await ProduitRestController.getAll();

      if (error) throw error;
      return data;
    },
    select: (response) => response?.data,
  });
};
