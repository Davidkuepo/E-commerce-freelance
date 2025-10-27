import { Link } from "react-router";
import BaseImage from "./BaseImage";
import ButtonWrapper from "./ButtonWrapper";
import type { ProduitResponseDto } from "@/services/main";

export default function ProductItem({
  product,
}: {
  product: ProduitResponseDto;
}) {
  return (
    <Link
      to={`/product/${product.produitCode}`}
      className="rounded-lg shadow p-2 flex flex-col gap-2"
    >
      <BaseImage className="h-20" source={product.image} alt="Product Image" />
      <h2 className="text-lg font-semibold mt-2">{product.nom}</h2>
      <div className="flex justify-between items-center">
        <span>{product.categorie}</span>
        <span>stock: {product.stock}</span>
      </div>
      <p className="text-gray-600">{product.prix} FCFA</p>
      <ButtonWrapper variant="default">Add to Cart</ButtonWrapper>
    </Link>
  );
}
