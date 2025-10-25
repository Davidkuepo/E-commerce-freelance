import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

import Home from "@/pages/Home";

const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));

const Cart = lazy(() => import("@/pages/Cart"));

const ProductList = lazy(() => import("@/pages/products/List"));
const EditProduct = lazy(() => import("@/pages/products/Edit"));
const CreateProduct = lazy(() => import("@/pages/products/Add"));
const ProductDetails = lazy(() => import("@/pages/products/Details"));

export default function Index() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route index element={<Home />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="product">
          <Route index element={<ProductList />} />
          <Route path=":productId/details" element={<ProductDetails />} />
          <Route path=":productId/edit" element={<EditProduct />} />
          <Route path="new" element={<CreateProduct />} />
        </Route>

        <Route path="cart" element={<Cart />} />
      </Routes>
    </Suspense>
  );
}
