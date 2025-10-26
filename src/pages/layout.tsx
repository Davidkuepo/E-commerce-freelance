import { Outlet } from "react-router";

import AppFooter from "@/layouts/app-footer";
import AppHeader from "@/layouts/app-header";

export default function AppLayout() {
  return (
    <>
      <AppHeader />
      <Outlet />
      <AppFooter />
    </>
  );
}
