import { ProduitRestController } from "@/services/main";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export const useDeleteProduct = () => {
	const navigate = useNavigate();

  return useMutation({
    mutationKey: ["delete-product"],
    mutationFn: async (id: string) => {
      const { data, error, status } = await ProduitRestController.delete1({
        query: {
          produitCode: id,
        },
      });
      if (error) {
				toast.error(`Error: ${status} - ${error}`);
				throw error;
			}

      return data;
    },
		onSuccess() {
			navigate("/product")
		}
  });
};
