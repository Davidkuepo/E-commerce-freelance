import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Pages from "@/pages";
import { setToken } from "@/utils/interceptors";
import { SessionProvider } from "@/context/useSession/SessionProvider";

const queryClient = new QueryClient();

export default function App() {
  setToken();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <BrowserRouter>
          <Pages />
          <Toaster />
        </BrowserRouter>
      </SessionProvider>
    </QueryClientProvider>
  );
}
