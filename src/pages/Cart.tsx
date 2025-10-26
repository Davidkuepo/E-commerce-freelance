import { Link } from "react-router";
import ButtonWrapper from "@/components/ButtonWrapper";

export default function Cart() {
  return (
    <section className="container mx-auto py-8 max-w-3xl space-y-4">
      <h2 className="text-2xl font-semibold">Votre Panier</h2>

      <div className="flex items-center justify-center">
        {/* <mat-progress-spinner mode="indeterminate" diameter="36"></mat-progress-spinner> */}
      </div>

      <div className="text-gray-600">
        Votre panier est vide.
        <Link to="/" className="text-cyan-700 font-medium hover:underline ml-1">
          Continuer vos achats
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3 bg-white">
          <div>
            <div className="font-medium">item.product?.name </div>
            <div className="text-sm text-gray-600">
              item.product?.price | number: '1.0-2' item.product?.currency ||
              'USD'
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 border rounded">-</button>
            <span>item.quantity</span>
            <button className="px-2 py-1 border rounded">+</button>
            <button className="px-3 py-1 border rounded text-red-600">
              Retirer
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <div className="text-lg font-semibold">Total</div>
          <div className="text-lg font-semibold">
            total() | number: '1.0-2' currency()
          </div>
        </div>

        <div className="flex justify-end">
          <ButtonWrapper variant="default" type="button">
            Valider la commande
          </ButtonWrapper>
        </div>
      </div>
    </section>
  );
}
