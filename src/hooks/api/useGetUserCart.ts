import { useQuery } from "@tanstack/react-query";
import { PanierRestController } from "@/services/main";
import { useAuth } from "@/context/useAuth/AuthContext.tsx";
import { useCart } from "@/context/useCart/CartContext";

export const useGetUserCart = (enabled: true) => {
  const {userInfo} = useAuth();
	const { setCart } = useCart();

  return useQuery({
    queryKey: ["user-cart"],
    queryFn: async () => {
      const { data, error } = await PanierRestController.getByClientCode({
        query: { clientCode: userInfo.code },
      });

      if (error) throw error;
			if (data && data.data) {
				setCart({
					code: data.data.panierCode,
					hasCart: true,
					totalItems: data.data.produits.length,
					items: data.data.produits
				})
			}

      return data?.data;
    },
		enabled
  });
};
