import { Link, useParams } from "react-router";

import BaseImage from "@/components/BaseImage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useProductItemClient } from "@/hooks/api/useProductItemClient";
import type { ProduitResponseDto } from "@/services/main";
import { Button } from "@/components/ui/button";
import DeleteProduct from "@/components/DeleteProduct";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const { data: product, isLoading } = useProductItemClient(productId!);

  return (
    <section className="container mx-auto py-8 max-w-4xl">
      {isLoading ? (
        <LoadingSpinner />
      ) : product ? (
        <ProductDetailsContent product={product} />
      ) : (
        <ProductNotFound />
      )}
    </section>
  );
}

function ProductNotFound() {
  return (
    <div className="text-center text-gray-600">
      Produit introuvable.
      <Link to="/" className="text-cyan-700 font-medium hover:underline ml-1">
        Voir les produits
      </Link>
    </div>
  );
}

function ProductDetailsContent({ product }: { product: ProduitResponseDto }) {
  return (
    <div className="flex flex-col">
      <BaseImage source={product.image} className="h-52" />
      <div className="flex gap-2 items-center my-4">
        <Button variant="default">Edit</Button>
        <DeleteProduct productId={product.produitCode} />
      </div>
      <div className="flex gap-10">
        <div className="flex flex-col gap-2">
          <span>Nom</span>
          <span className="font-bold text-sm">{product.nom}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span>Prix</span>
          <span className="font-bold text-sm">{product.prix}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span>Categorie</span>
          <span className="font-bold text-sm">{product.categorie}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span>Stock</span>
          <span className="font-bold text-sm">{product.stock}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span>Status</span>
          <span className="font-bold text-sm">{product.state}</span>
        </div>
      </div>
      <div className="mt-4">
        <Collapsible>
          <div className="flex gap-2 items-center justify-between font-bold p-1">
            <span>Description</span>
            <CollapsibleTrigger asChild>
              <Button variant="ghost">
                <ChevronsUpDown />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-2 p-4 rounded-lg border">{product.description}</CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
