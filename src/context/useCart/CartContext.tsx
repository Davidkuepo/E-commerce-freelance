import type { Cart } from "@/utils/type";
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

type Context = {
  cart: Cart;
  setCart: Dispatch<SetStateAction<Cart | undefined>>;
};

const cart = createContext<Context>({} as Context);

const useCart = () => useContext(cart);

export { cart, useCart };
