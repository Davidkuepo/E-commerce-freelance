import { FileController } from "@/services/main";
import { useMutation } from "@tanstack/react-query";

export const useDeleteImage = () => {
  return useMutation({
    mutationKey: ["delete-image"],
    mutationFn: async (fileId: number) => {
      const { error } = await FileController.deleteFile({
        path: { id: fileId },
      });
      if (error) throw error;
    },
  });
};
