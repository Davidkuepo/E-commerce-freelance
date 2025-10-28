import { useState, type ReactNode, useMemo } from "react";

import type { UserInfo } from "@/utils/type";
import { STORAGE_USER_INFO_KEY } from "@/utils/constants";
import { auth } from "@/context/useAuth/AuthContext.tsx";

const json = localStorage.getItem(STORAGE_USER_INFO_KEY);
const defaultValue: UserInfo = json ? JSON.parse(json) : ({} as UserInfo);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>(defaultValue);
  const isAuthenticated = useMemo(() => !!userInfo.token, [userInfo]);

  return (
    <auth.Provider value={{ userInfo, setUserInfo, isAuthenticated }}>
      {children}
    </auth.Provider>
  );
};
