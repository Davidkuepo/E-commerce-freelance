import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Pages from "@/pages";
import { SessionProvider } from "@/context/useSession/SessionProvider";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SessionProvider>
          <Pages />
        </SessionProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
