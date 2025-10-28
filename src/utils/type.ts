import type { ProduitResponseDto } from "@/services/main";
import * as yup from "yup";

export type UserInfo = {
  code: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
};

export type Cart = {
	code: string;
  hasCart: boolean;
  totalItems: number;
	items?: Array<ProduitResponseDto>;
};

export const loginSchema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

export const registerSchema = yup
  .object({
    produitCode: yup.string().required(),
    nom: yup.string().required(),
    description: yup.string().required(),
    prix: yup.number().required(),
    stock: yup.number().required(),
    categorie: yup.string().required(),
    state: yup
      .string()
      .oneOf(["ACTIVE", "INACTIVE", "DELETED", "CREATE_BUT_NOT_ACTIVE"])
      .required(),
    image: yup.string().required(),
  })
  .required();

export const filterSchema = yup
  .object({
    name: yup.string().optional(),
    minPrice: yup.string()
			.notRequired()
			.matches(/^\d+$/, { message: 'Only digits', excludeEmptyString: true }),
    maxPrice: yup.string()
			.notRequired()
			.matches(/^\d+$/, { message: 'Only digits', excludeEmptyString: true }),
  }).required();
