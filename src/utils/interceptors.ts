import { client } from "@/services/main/client.gen";
import { STORAGE_ACCESS_TOKEN_KEY } from "@/utils/constants";

export const setToken = (token?: string) => {
  const cachedToken = localStorage.getItem(STORAGE_ACCESS_TOKEN_KEY);
  client.setConfig({ auth: token || cachedToken || "" });
};
