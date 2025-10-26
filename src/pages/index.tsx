import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

import Landing from "@/pages/Landing";
import PageLoadingIndicator from "@/components/PageLoadingIndicator";
import AppLayout from "./layout";

const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));

const Cart = lazy(() => import("@/pages/Cart"));

const ProductList = lazy(() => import("@/pages/products/List"));
const EditProduct = lazy(() => import("@/pages/products/Edit"));
const CreateProduct = lazy(() => import("@/pages/products/Add"));
const ProductDetails = lazy(() => import("@/pages/products/Details"));

export default function Index() {
  return (
    <Suspense fallback={<PageLoadingIndicator />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Landing />} />

          <Route path="product">
            <Route index element={<ProductList />} />
            <Route path=":productId/details" element={<ProductDetails />} />
            <Route path=":productId/edit" element={<EditProduct />} />
            <Route path="new" element={<CreateProduct />} />
          </Route>

          <Route path="cart" element={<Cart />} />
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </Suspense>
  );
}
