import { useQuery } from "@tanstack/react-query";
import { PanierRestController } from "@/services/main";
import { useSession } from "@/context/useSession/SessionContext";

export const useGetUserCart = () => {
  const session = useSession();

  return useQuery({
    queryKey: ["user-cart"],
    queryFn: async () => {
      const { data, error } = await PanierRestController.getByClientCode({
        query: { clientCode: session.userInfo.userCode },
      });

      if (error) throw error;
      
      return data?.data;
    },
  });
};
