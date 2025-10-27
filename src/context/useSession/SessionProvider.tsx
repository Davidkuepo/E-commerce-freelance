import { useState, type ReactNode } from "react";

import type { UserInfo } from "@/utils/type";
import { STORAGE_USER_INFO_KEY } from "@/utils/constants";
import { session } from "@/context/useSession/SessionContext";

const json = localStorage.getItem(STORAGE_USER_INFO_KEY);
const defaultValue: UserInfo = json ? JSON.parse(json) : ({} as UserInfo);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>(defaultValue);

  return (
    <session.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </session.Provider>
  );
};
