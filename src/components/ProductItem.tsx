import { useMemo, MouseEvent } from "react";
import { Link } from "react-router";
import { FiShoppingCart } from "react-icons/fi";
import { Button } from "@/components/ui/button.tsx";
import type { ProduitResponseDto } from "@/services/main";
import { useAddProductCart } from "@/hooks/api/useAddProductCart.ts";
import BaseImage from "@/components/BaseImage";
import LoadingSpinner from "@/components/LoadingSpinner.tsx";
import { useCart } from "@/context/useCart/CartContext";

export default function ProductItem({
  product,
}: {
  product: ProduitResponseDto;
}) {
  const { cart } = useCart();
  const { mutate, isPending } = useAddProductCart();
  const addToCart = (event: MouseEvent) => {
		event.preventDefault();
    mutate({
      produitCode: product.produitCode,
      quantite: 1,
    });
  };

  const isAlreadyAddedInCart = useMemo(() => {
    if (cart.items) {
      cart.items.some((it) => it.produitCode === product.produitCode);
    }
    return false;
  }, [cart, product]);

  return (
    <Link
      to={`/product/${product.produitCode}/details`}
      className="rounded border flex flex-col gap-2"
    >
      <BaseImage className="h-52" source={product.image} alt="Product Image" />
      <div className="p-2 flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{product.nom}</h2>
        <span className="rounded-lg p-1 text-xs bg-gray-200 text-gray-500 w-fit">
          {product.categorie}
        </span>
        <div className="flex justify-between items-center">
          <span>{product.prix} FCFA</span>
          <span className="text-gray-600">stock: {product.stock}</span>
        </div>
        {!isAlreadyAddedInCart && (
          <Button
            onClick={addToCart}
            disabled={isPending}
            className="bg-gray-600"
          >
            <FiShoppingCart />
            {isPending && <LoadingSpinner />}Add to Cart
          </Button>
        )}
      </div>
    </Link>
  );
}
