import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { generateId } from "@/utils/helpers";
import { PanierRestController } from "@/services/main";

import { useCart } from "@/context/useCart/CartContext";
import { useAuth } from "@/context/useAuth/AuthContext";

export const useAddProductCart = () => {
  const { userInfo } = useAuth();
  const { cart, setCart } = useCart();

  const addProduct = async ({
    quantite,
    panierCode,
    produitCode,
  }: {
    quantite: number;
    panierCode: string;
    produitCode: string;
  }) => {
    return PanierRestController.addProduct({
      query: {
        panierCode,
        produitCode,
        quantite,
      },
    });
  };

  return useMutation({
    mutationKey: ["add-product-cart"],
    mutationFn: async (queryParams: {
      produitCode: string;
      quantite?: number;
    }) => {
      if (cart.hasCart) {
        const { error } = await addProduct({
          panierCode: cart.code,
          quantite: queryParams.quantite ?? 1,
          produitCode: queryParams.produitCode,
        });
        if (error) throw error;
      } else {
        const { error: cartError, data: cartData } =
          await PanierRestController.create1({
            body: {
              state: "ACTIVE",
              clientCode: userInfo.code,
              panierCode: generateId(),
            },
          });
        if (cartError) throw cartError;
        if (cartData && cartData.data) {
          const { error } = await addProduct({
            panierCode: cart.code,
            quantite: queryParams.quantite ?? 1,
            produitCode: queryParams.produitCode,
          });
          if (error) throw error;
          else {
            setCart({
              totalItems: 1,
              hasCart: true,
              code: cartData.data?.panierCode,
            });
          }
        }
        return cartData;
      }
    },
		onError(error) {
			toast.error(`${error.message}`);
		}
  });
};
