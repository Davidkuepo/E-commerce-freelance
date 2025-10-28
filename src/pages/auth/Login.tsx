import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { loginSchema } from "@/utils/type";
import { useLoginClient } from "@/hooks/api/useLoginClient";

import TextInput from "@/components/TextInput";
import ButtonWrapper from "@/components/ButtonWrapper";
import PasswordInput from "@/components/PasswordInput.tsx";

export default function Login() {
  const { mutate, isPending } = useLoginClient();
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = handleSubmit((data) => mutate(data));

  return (
    <section className="mx-auto max-w-xl px-4 py-6 sm:py-8">
      <form
        onSubmit={onSubmit}
        className="w-full flex flex-col p-4 md:p-8 gap-4"
      >
        <h2 className="text-cnter text-2xl sm:text-3xl md:text-4xl text-gray-900 font-medium">
          Sign in
        </h2>
        <p className="text-cnter text-sm text-gray-500/90">
          Welcome back! Please sign in to continue
        </p>
        <TextInput label="Email" type="email" {...register("email")} />
        <PasswordInput label="Password" {...register("password")} />
        <div className="flex mt-7">
          <ButtonWrapper
            className="grow"
            loading={isPending}
            variant="default"
            type="submit"
          >
            Login
          </ButtonWrapper>
        </div>
      </form>
    </section>
  );
}
