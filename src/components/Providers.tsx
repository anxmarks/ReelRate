"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Session_Provider from "./SessionProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Session_Provider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Session_Provider>
  );
}
