import { Link } from "react-router";

export default function AppFooter() {
    const currentYear = new Date().getFullYear();

    return (
    <footer className="bg-white border-t border-gray-200 mt-10">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2">
            {/* <mat-icon color="primary">storefront</mat-icon> */}
            <span className="font-semibold">E-Commerce</span>
          </div>
          <p className="text-gray-600 mt-2 text-sm">
            Votre boutique en ligne pour des achats rapides et sécurisés.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-3">Liens</div>
          <div className="space-y-2 text-sm">
            <Link to="/" className="block text-gray-700 hover:text-cyan-700">
              Accueil
            </Link>
            <Link
              to="/products"
              className="block text-gray-700 hover:text-cyan-700"
            >
              Produits
            </Link>
            <Link
              to="/cart"
              className="block text-gray-700 hover:text-cyan-700"
            >
              Panier
            </Link>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-3">Suivez-nous</div>
          <div className="flex items-center gap-3 text-gray-600">
            {/* <mat-icon>facebook</mat-icon>
            <mat-icon>twitter</mat-icon>
            <mat-icon>instagram</mat-icon> */}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-4 text-sm text-gray-500 flex justify-between">
          <span>&copy; { currentYear } E-Commerce. Tous droits réservés.</span>
          <div className="flex gap-4">
            <Link to="/" className="hover:underline">
              Conditions
            </Link>
            <Link to="/" className="hover:underline">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
