import {
  ProduitRestController,
  type ProduitResponseDto,
} from "@/services/main";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useProductListClient = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error, status } = await ProduitRestController.getAll();

      if (error) {
        toast.error(`Une erreur est survenue | ${status} - ${error}`);
        throw error;
      }
      return data;
    },
    select: (response) => response?.data as ProduitResponseDto[],
  });
};
