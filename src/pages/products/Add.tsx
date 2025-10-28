import useCreateProduct from "@/hooks/api/useCreateProduct";
import { registerSchema } from "@/utils/type";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

export default function CreateProduct() {
  const { mutate } = useCreateProduct();
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = handleSubmit((data) => mutate(data));

  return <div></div>;
}
