import { FileController } from "@/services/main";
import { useMutation } from "@tanstack/react-query";

export const useCreateImage = () => {
  return useMutation({
    mutationKey: ["create-image"],
    mutationFn: async (file: File) => {
      const { data, error } = await FileController.uploadFile({
        body: { file },
      });
      if (error) throw error;

      return data?.id;
    },
  });
};
