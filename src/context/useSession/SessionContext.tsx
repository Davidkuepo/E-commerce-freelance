import { createContext, useContext, type Dispatch } from "react";
import type { UserPrincipal } from "@/services/main";

type Context = {
  userInfo: UserPrincipal;
  setUserInfo: Dispatch<React.SetStateAction<UserPrincipal>>;
};

const session = createContext<Context>({} as Context);

const useSession = () => useContext(session);

export { session, useSession };