import { Link, useParams } from "react-router";

import BaseImage from "@/components/BaseImage";
import ButtonWrapper from "@/components/ButtonWrapper";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useProductItemClient } from "@/hooks/api/useProductItemClient";

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

function ProductDetailsContent({ product }: { product: unknown }) {
  console.log(product);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <BaseImage source="" alt="" />
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">product()?.name</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <svg
            className="w-4 h-4 text-amber-500"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
          <span>product()?.rating || 0</span>
        </div>
        <div className="text-cyan-700 text-xl font-bold">
          product()?.price | number: '1.0-2' product()?.currency || 'USD'
        </div>
        <p className="text-gray-700 leading-relaxed">product()?.description</p>
        <div className="flex items-center gap-2">
          <ButtonWrapper variant="default">Ajouter au panier</ButtonWrapper>
          <Link to="/" className="text-cyan-700 font-medium hover:underline">
            Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
