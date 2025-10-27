import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

import { setToken } from "@/utils/interceptors";
import { AuthenticationRestController } from "@/services/main";
import { useSession } from "@/context/useSession/SessionContext";
import {
  STORAGE_USER_INFO_KEY,
  STORAGE_ACCESS_TOKEN_KEY,
  STORAGE_REDIRECT_ROUTE_KEY,
} from "@/utils/constants";

export const useLoginClient = () => {
  const session = useSession();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data: json, error } = await AuthenticationRestController.login({
        body: {
          login: email,
          password: password,
        },
      });

      if (error) throw error;
      if (json) {
        const token = json.data?.token ?? "";
        const userInfo = {
          token,
          code: json.data?.userCode ?? "",
          username: json.data?.username ?? "",
          firstName: json.data?.userFirstName ?? "",
          lastName: json.data?.userLastName ?? "",
          email: json.data?.userEmail ?? "",
        };

        localStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, token);
        localStorage.setItem(STORAGE_USER_INFO_KEY, JSON.stringify(userInfo));

        session.setUserInfo(userInfo);
        setToken(token);
      }
    },
    onSuccess: () => {
      const redirectRoute =
        localStorage.getItem(STORAGE_REDIRECT_ROUTE_KEY) || "/";
      localStorage.removeItem(STORAGE_REDIRECT_ROUTE_KEY);
      navigate(redirectRoute);
    },
  });
};
