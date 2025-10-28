import { Link, Outlet } from "react-router";
import { BsCart3 } from "react-icons/bs";
import ButtonWrapper from "@/components/ButtonWrapper.tsx";
import { useAuth } from "@/context/useAuth/AuthContext.tsx";
import { useCart } from "@/context/useCart/CartContext.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { useMemo } from "react";
import { Button } from "@/components/ui/button.tsx";

export default function AppLayout() {
  const { cart } = useCart();
  const { isAuthenticated, userInfo } = useAuth();

  const user = useMemo(() => {
    const firstPart = userInfo.firstName?.split("")?.[0] ?? "";
    const lastPart = userInfo.lastName?.split("")?.[0] ?? "";

    return {
      initials: `${firstPart}${lastPart}`,
      fullName: userInfo.firstName + " " + userInfo.lastName,
    };
  }, [userInfo]);

  return (
    <>
      <header className="flex justify-between items-center pb-2 p-4">
        <div className="flex items-end gap-1">
          <span className="font-bold text-2xl rounded-lg bg-primary text-white px-4 py-2">
            E
          </span>
          <span>Commerce</span>
        </div>
        {isAuthenticated ? (
          <div className="flex gap-2 items-center">
            <Link to="/cart">
              <Button variant="default">
                <BsCart3 />
                Panier
                {cart.totalItems && (
                  <sup className="text-yellow-500 font-bold">
                    {cart.totalItems}
                  </sup>
                )}
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{user.initials}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="flex flex-col items-start gap-2">
                  <span>{user.fullName}</span>
                  <span className="text-sm font-bold">{userInfo.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-4">
                  <Link to="/my/products">Mes produits</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button variant="destructive" className="block w-full">
                    Se deconnecter
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link to="/login">
            <ButtonWrapper variant="default">Se connecter</ButtonWrapper>
          </Link>
        )}
      </header>
      <Outlet />
    </>
  );
}
