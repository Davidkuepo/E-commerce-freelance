import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Pages from "@/pages";
import { setToken } from "@/utils/interceptors";
import { AuthProvider } from "@/context/useAuth/AuthProvider";
import { CartProvider } from "@/context/useCart/CartProvider";

const queryClient = new QueryClient();

export default function App() {
  setToken();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Pages />
            <Toaster />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
