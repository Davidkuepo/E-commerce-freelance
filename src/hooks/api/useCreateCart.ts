import { useMutation } from "@tanstack/react-query";
import { PanierRestController, type PanierRequestDto } from "@/services/main";

export const useCreateCart = () => {
  return useMutation({
    mutationKey: ["create-cart"],
    mutationFn: async (payload: PanierRequestDto) => {
      const { error, data } = await PanierRestController.create1({ body: payload });
      if (error) throw error;
      return data?.data;
    },
  });
};
