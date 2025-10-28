import type { UserInfo } from "@/utils/type";
import {
  createContext,
  useContext,
  type Dispatch,
  SetStateAction,
} from "react";

type Context = {
  userInfo: UserInfo;
  isAuthenticated: boolean;
  setUserInfo: Dispatch<SetStateAction<UserInfo | undefined>>;
};

const auth = createContext<Context>({} as Context);

const useAuth = () => useContext(auth);

export { auth, useAuth };
