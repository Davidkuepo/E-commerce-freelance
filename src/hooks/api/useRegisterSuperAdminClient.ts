import { useMutation } from "@tanstack/react-query";
import {
  AuthenticationRestController,
  type SuperAdminRequestDto,
} from "@/services/main";

export const useRegisterSuperAdminClient = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (payload: SuperAdminRequestDto) => {
      const { data, error } =
        await AuthenticationRestController.createSuperAdmin({
          body: payload,
        });

      if (error) throw error;
      return data?.data;        
    },
  });
};
