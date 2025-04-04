"use client";

import { SessionProvider } from "next-auth/react";

export default function Session_Provider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
