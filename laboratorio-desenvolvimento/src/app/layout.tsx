import type { Metadata } from "next";
import Provider from "../components/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReelRate",
  description: "Descubra, avalie e compartilhe filmes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
