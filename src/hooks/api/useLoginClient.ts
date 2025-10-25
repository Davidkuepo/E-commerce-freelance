import { useMutation } from "@tanstack/react-query"; 

import { client } from "@/services/main/client.gen";
import { AuthenticationRestController } from "@/services/main";
import { useSession } from "@/context/useSession/SessionContext";

export const useLoginClient = () => {
  const session = useSession();

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
        client.setConfig({ auth: json.data.token });
        session.setUserInfo(json.data);
      }
    },
  });
};
