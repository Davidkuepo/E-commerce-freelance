import { useState, type ReactNode } from "react";

import type { UserPrincipal } from "@/services/main";
import { session } from "@/context/useSession/SessionContext";

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserPrincipal>({} as UserPrincipal);

  return (
    <session.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </session.Provider>
  );
};