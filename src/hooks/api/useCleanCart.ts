import { PanierRestController } from "@/services/main";
import { useMutation } from "@tanstack/react-query";

export const useCleanCart = () => {
  return useMutation({
    mutationKey: ["clean-cart"],
    mutationFn: async (panierCode: string) => {
      const { error, data } = await PanierRestController.clear({
        query: { panierCode },
      });
      if (error) throw error;
      return data?.data;
    },
  });
};
