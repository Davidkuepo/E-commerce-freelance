import { ProduitRestController } from "@/services/main";
import { useQuery } from "@tanstack/react-query";

export const useProductItemClient = (reference: string) => {
  return useQuery({
    queryKey: [reference, "product"],
    queryFn: async ({ queryKey }) => {
      const [produitCode] = queryKey;
      const { data, error } = await ProduitRestController.getByCode({
        query: { produitCode },
      });

      if (error) throw error;
      return data;
    },
    select: (response) => response?.data,
  });
};
