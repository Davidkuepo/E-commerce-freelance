import { Link } from "react-router";
import BaseImage from "@/components/BaseImage";
import TextInput from "@/components/TextInput";
import ProductItem from "@/components/ProductItem";
import ButtonWrapper from "@/components/ButtonWrapper";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useProductListClient } from "@/hooks/api/useProductListClient";

export default function Landing() {
  const { data: products, isLoading } = useProductListClient();

  return (
    <section className="min-h-[calc(100vh-64px-240px)]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-700 via-sky-600 to-emerald-600"></div>
        <div className="absolute -top-24 -right-16 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="relative container mx-auto px-4 py-16 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                Achetez mieux. Vendez plus.
              </h1>
              <p className="mt-4 text-white/90 text-lg">
                Découvrez des produits de qualité et profitez de nos meilleures
                offres du moment.
              </p>
              <div className="mt-6 flex gap-3">
                <Link
                  to="/products"
                  className="px-5 py-3 rounded-xl bg-white text-cyan-700 font-semibold shadow hover:shadow-md transition"
                >
                  Découvrir les produits
                </Link>
                <Link
                  to="/cart"
                  className="px-5 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition"
                >
                  Voir mon panier
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 block">
              <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10">
                <BaseImage source="https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&auto=format&fit=crop&w=1200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-start gap-3">
            <svg
              className="w-6 h-6 text-emerald-600"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M3 5h13v11H3zM18 8h4l-2-3h-2zM6 18a2 2 0 112 2 2 2 0 01-2-2m10 0a2 2 0 112 2 2 2 0 01-2-2"
              />
            </svg>
            <div>
              <div className="font-semibold">Livraison rapide</div>
              <div className="text-gray-600 text-sm">
                Partout au Cameroun, en 48-72h
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-start gap-3">
            <svg
              className="w-6 h-6 text-cyan-600"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M12 2l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"
              />
            </svg>
            <div>
              <div className="font-semibold">Qualité garantie</div>
              <div className="text-gray-600 text-sm">
                Produits vérifiés et conformes
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-start gap-3">
            <svg
              className="w-6 h-6 text-amber-600"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path fill="currentColor" d="M3 5h18v14H3zM3 8h18v3H3z" />
            </svg>
            <div>
              <div className="font-semibold">Paiement sécurisé</div>
              <div className="text-gray-600 text-sm">
                Mobile Money, cartes, et plus
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-start gap-3">
            <svg
              className="w-6 h-6 text-rose-600"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M12 2a7 7 0 017 7v3a4 4 0 01-4 4h-2v-2h2a2 2 0 002-2V9a5 5 0 10-10 0v8H6v-8a7 7 0 016-7z"
              />
            </svg>
            <div>
              <div className="font-semibold">Support 7j/7</div>
              <div className="text-gray-600 text-sm">
                Nous sommes là pour vous aider
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Catégories populaires</h2>
          <Link to="/products" className="text-cyan-700 hover:underline">
            Voir tout
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/products"
            className="group rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="h-40 overflow-hidden">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition"
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&auto=format&fit=crop&w=600"
                alt="Tech"
              />
            </div>
            <div className="p-3 font-medium">Technologie</div>
          </Link>
          <Link
            to="/products"
            className="group rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="h-40 overflow-hidden">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition"
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&auto=format&fit=crop&w=600"
                alt="Fashion"
              />
            </div>
            <div className="p-3 font-medium">Mode</div>
          </Link>
          <Link
            to="/products"
            className="group rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="h-40 overflow-hidden">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition"
                src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&auto=format&fit=crop&w=600"
                alt="Sneakers"
              />
            </div>
            <div className="p-3 font-medium">Chaussures</div>
          </Link>
          <Link
            to="/products"
            className="group rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="h-40 overflow-hidden">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition"
                src="https://images.unsplash.com/photo-1492447166138-50c3889fccb1?q=80&auto=format&fit=crop&w=600"
                alt="Home"
              />
            </div>
            <div className="p-3 font-medium">Maison</div>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Meilleures offres</h2>
          <Link to="/products?g=deal" className="text-cyan-700 hover:underline">
            Voir tout
          </Link>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : products ? (
          products.map((product) => (
            <ProductItem key={product.produitCode} product={product} />
          ))
        ) : (
          <div className="text-center text-gray-500">
            Aucune offre pour le moment.
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Meilleures ventes</h2>
          <Link to="/products?g=best" className="text-cyan-700 hover:underline">
            Voir tout
          </Link>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : products ? (
          products.map((product) => (
            <ProductItem key={product.produitCode} product={product} />
          ))
        ) : (
          <div className="text-center text-gray-500">
            Aucune meilleure vente pour le moment.
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Nouveautés</h2>
          <Link to="/products?g=new" className="text-cyan-700 hover:underline">
            Voir tout
          </Link>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : products ? (
          products.map((product) => (
            <ProductItem key={product.produitCode} product={product} />
          ))
        ) : (
          <div className="text-center text-gray-500">
            Aucune nouveauté pour le moment.
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center md:items-stretch gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-semibold">
              Recevez nos offres et nouveautés
            </h3>
            <p className="text-gray-600 mt-2">
              Inscrivez-vous à notre newsletter pour ne rien manquer.
            </p>
            <form className="mt-4 flex flex-col gap-3 md:flex-row">
              <div className="flex-1">
                <TextInput label="Votre email" type="email" name="email" />
              </div>
              <div className="md:self-end">
                <ButtonWrapper variant="default" type="submit">
                  S'inscrire
                </ButtonWrapper>
              </div>
            </form>
          </div>
          <div className="md:w-1/2 block">
            <BaseImage
              source="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&auto=format&fit=crop&w=900"
              alt="Newsletter"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
