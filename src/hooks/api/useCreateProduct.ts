import { type ProduitRequestDto, ProduitRestController } from "@/services/main";
import { useMutation } from "@tanstack/react-query";

export default function useCreateProduct() {
    return useMutation({
    mutationKey: ["create-product"],
    mutationFn: async (payload: ProduitRequestDto) => {
      const { error, data } = await ProduitRestController.create({ body: payload });
      if (error) throw error;
      return data?.data;
    },
  });
}