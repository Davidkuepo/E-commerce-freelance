import { useState, type ReactNode } from "react";

import type { Cart } from "@/utils/type";
import { cart } from "@/context/useCart/CartContext";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [userCart, setUserCart] = useState<Cart>({} as Cart);

  return (
    <cart.Provider value={{ cart: userCart, setCart: setUserCart }}>
      {children}
    </cart.Provider>
  );
};
