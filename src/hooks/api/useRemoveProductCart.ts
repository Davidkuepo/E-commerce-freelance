import { PanierRestController } from "@/services/main";
import { useMutation } from "@tanstack/react-query";

export const useRemoveProductCart = () => {
  return useMutation({
    mutationKey: ["remove-product-cart"],
    mutationFn: async (queryParams: {
      panierCode: string;
      produitCode: string;
      quantite: number;
    }) => {
      const { error, data } = await PanierRestController.removeProduct({
        query: queryParams,
      });
      if (error) throw error;
      return data?.data;
    },
  });
};
