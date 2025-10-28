import TextInput from "@/components/TextInput";
import { Button } from "@/components/ui/button";
import useCreateProduct from "@/hooks/api/useCreateProduct";
import { registerSchema } from "@/utils/type";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { Info } from "lucide-react"
import UploadFile from "@/components/UploadFile";

export default function CreateProduct() {
  const { mutate, isSuccess, data: productId } = useCreateProduct();
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(registerSchema),
		defaultValues: {
			state: "ACTIVE"
		}
  });

  const onSubmit = handleSubmit((data) => mutate(data));

  return (
    <div className="mt-7 max-w-2xl m-auto border p-5">
      {isSuccess ? (
        <div className="p-10 flex flex-col gap-2 items-center">
          <h1>Le produit a ete cree avec succes</h1>
          <Link to={`/product/${productId}`}>
            <Button variant="default">OK</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <h1>Formulaire de creation d'un produit</h1>
            <span className="flex gap-2 items-center bg-blue-100 text-gray-800 p-2 text-xs rounded-lg">
							<Info className="size-4" />
							<span>Veuillez remplir tous les champs ci dessous</span>
            </span>
          </div>
					<TextInput label="nom" {...register("nom")} />
					<TextInput label="code du produit" {...register("produitCode")} />
					<TextInput label="categorie" {...register("categorie")} />
					<TextInput label="description" {...register("description")} />
					<TextInput label="prix" hint="veuillez entrer des chiffres" type="number" {...register("prix")} />
					<TextInput label="stock" hint="veuillez entrer des chiffres" type="number" {...register("stock")} />
					<UploadFile label="Image" {...register("image")} />
					<div className="mt-4 flex">
						<Button variant="default" type="submit">Enregistrer</Button>
					</div>
        </form>
      )}
    </div>
  );
}
