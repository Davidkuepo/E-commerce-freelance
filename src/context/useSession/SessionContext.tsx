import type { UserInfo } from "@/utils/type";
import { createContext, useContext, type Dispatch } from "react";

type Context = {
  userInfo: UserInfo;
  setUserInfo: Dispatch<React.SetStateAction<UserInfo | undefined>>;
};

const session = createContext<Context>({} as Context);

const useSession = () => useContext(session);

export { session, useSession };