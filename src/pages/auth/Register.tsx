import { Link } from "react-router";
import TextInput from "@/components/TextInput";
import ButtonWrapper from "@/components/ButtonWrapper";

export default function Register() {
  return (
    <section className="container mx-auto py-8 max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Créer un compte</h2>

      <form className="space-y-4">
        <TextInput label="Nom" name="name" />

        <TextInput type="email" label="Email" name="email" />

        <TextInput type="password" label="Mot de passe" name="email" />

        <ButtonWrapper variant="default" type="submit">
          S'inscrire
        </ButtonWrapper>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        Déjà un compte ?
        <Link to="/login" className="text-cyan-700 font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </section>
  );
}
