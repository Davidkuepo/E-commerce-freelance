import { useState } from "react";
import { Link } from "react-router";
import { FaPlus } from "react-icons/fa6";
import { Button } from "@/components/ui/button.tsx";
import { useAuth } from "@/context/useAuth/AuthContext.tsx";
import { useProductListClient } from "@/hooks/api/useProductListClient.ts";
import LoadingSpinner from "@/components/LoadingSpinner.tsx";
import type { ProduitResponseDto } from "@/services/main";
import ProductItem from "@/components/ProductItem.tsx";
import { useForm } from "react-hook-form";
import { filterSchema } from "@/utils/type.ts";
import { yupResolver } from "@hookform/resolvers/yup";

export default function WelcomePage() {
  const { userInfo } = useAuth();
  const { data: products, isLoading } = useProductListClient();

  return (
    <section>
      <div className="flex flex-col gap-2 bg-linear-to-r from-gray-500 to-gray-800 text-white p-5 md:p-10 lg:p-20">
        <h1 className="text-lg md:text-xl lg:text-2xl py-5 space-x-2">
          <span className="font-thin">Vous etes connecte en tant que</span>
          <span className="font-bold">
            {userInfo.firstName + " " + userInfo.lastName}
          </span>
        </h1>
        <Link to="/product/new">
          <Button size="lg" variant="secondary">
            <FaPlus />
            Ajoutez de nouveaux Produits
          </Button>
        </Link>
      </div>
			{isLoading ? (
				<LoadingSpinner />
			) : products && products.length ? (
				<ProductList products={products} />
			) : (
				<span>Aucun produit disponible</span>
			)}
    </section>
  );
}

function ProductList({ products }: { products: ProduitResponseDto[] }) {
  const {
		reset,
		register,
		handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitted },
  } = useForm({
    resolver: yupResolver(filterSchema),
  });

  const [filteredProducts, setFilteredProducts] = useState(products);

	const resetFilters = () => {
		reset();
		setFilteredProducts(products);
	}

  const applyFilters = handleSubmit(({ name, maxPrice, minPrice }) => {
		console.log(name, maxPrice, minPrice)
    const value = products.filter((product) => {
			const minPriceMatch = minPrice ? product.prix >= Number(minPrice) : true;
			const maxPriceMatch = maxPrice ? product.prix <= Number(maxPrice) : true;
			const nameMatch = name ? product.nom.toLowerCase().includes(name.toLowerCase()) : true;

      return nameMatch && maxPriceMatch && minPriceMatch;
    });

    setFilteredProducts(value);
  });

  return (
    <section className="container mx-auto">
      <form onSubmit={applyFilters} className="flex flex-col gap-2 p-2 max-w-2xl m-auto">
        <div className="grid grid-cols-2 gap-2 items-center">
          <input
            className="border p-2 rounded-lg focus:outline-none"
            type="number"
            placeholder="prix minimal"
            {...register("minPrice")}
          />
          <input
            className="border p-2 rounded-lg focus:outline-none"
            type="number"
            placeholder="prix maximal"
            {...register("maxPrice")}
          />
        </div>
        <div className="flex gap-2 items-center">
          <input
            placeholder="Recherchez par nom"
            className="border grow p-2 rounded-lg focus:outline-none"
            type="text"
            {...register("name")}
          />
					{isValid && isDirty && <Button type="submit">Filtrer</Button>}
					{isValid && isSubmitted && <Button variant="destructive" type="button" onClick={resetFilters}>clear</Button>}
        </div>
        {errors.name && (
          <span className="text-xs text-red-500">{errors.name.message}</span>
        )}
        {errors.minPrice && (
          <span className="text-xs text-red-500">
            {errors.minPrice.message}
          </span>
        )}
        {errors.maxPrice && (
          <span className="text-xs text-red-500">
            {errors.maxPrice.message}
          </span>
        )}
      </form>
      {filteredProducts.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {filteredProducts.map((product) => (
            <ProductItem product={product} key={product.produitCode} />
          ))}
        </div>
      ) : (
        <span>Aucun produit ne correspond a votre recherche</span>
      )}
    </section>
  );
}
