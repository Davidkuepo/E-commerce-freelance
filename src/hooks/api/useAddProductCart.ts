import { PanierRestController } from "@/services/main";
import { useMutation } from "@tanstack/react-query";

export const useAddProductCart = () => {
  return useMutation({
    mutationKey: ["add-product-cart"],
    mutationFn: async (queryParams: {
        panierCode: string;
        produitCode: string;
        quantite: number;
    }) => {
      const { error, data } = await PanierRestController.addProduct({
        query: queryParams,
      });
      if (error) throw error;
      return data?.data;
    },
  });
};
