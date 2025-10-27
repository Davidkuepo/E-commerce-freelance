import ButtonWrapper from "@/components/ButtonWrapper";
import CheckboxInput from "@/components/CheckboxInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import TextInput from "@/components/TextInput";

export default function ProductList() {
  return (
    <section className="container mx-auto py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Tous les produits</h2>
        <div className="flex items-center gap-2">
          <div className="w-64">
            <TextInput label="Rechercher" placeholder="Rechercher..." />
          </div>
          <ButtonWrapper variant="default">Rechercher</ButtonWrapper>
          <div className="ml-2 hidden sm:flex items-center gap-1 border border-gray-200 rounded-lg bg-white px-1">
            <ButtonWrapper variant="accent">
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"
                />
                <path
                  fill="currentColor"
                  d="M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z"
                />
              </svg>
            </ButtonWrapper>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Filtres</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50">
              Réinitialiser
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TextInput label="Prix min" type="number" name="minPrice" />
          <TextInput label="Prix max" type="number" name="maxPrice" />
          <TextInput
            label="Note minimale"
            type="number"
            hint="Entrez une valeur entre 0 et 5"
            name="rate"
          />

          <div>
            <label className="block text-xs text-gray-600 mb-1">Etat</label>
            <select className="w-full rounded-md border border-gray-200 px-3 py-2">
              <option value="all">Tous</option>
              {/* 
              map go here
              <option>{ s }</option> 
              */}
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <CheckboxInput name="inStock" label="En stock seulement" />
        </div>
      </div>

      <LoadingSpinner />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* <app-product-cart-item
              *ngFor="let p of filteredProducts()"
              [product]="p"
              (addToCart)="addToCart($event)"
            /> */}
      </div>
      <ProductNotAvailable />
    </section>
  );
}

function ProductNotAvailable() {
  return <div className="text-center text-gray-500">Aucun produit trouvé.</div>;
}
