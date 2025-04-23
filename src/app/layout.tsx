import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "ReelRate",
  description: "Descubra, avalie e compartilhe filmes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="relative">
        <Providers>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            toastStyle={{
              backgroundColor: '#424769',
              color: '#f9b17a',
              borderRadius: '8px',
              margin: '10px',
            }}
          />
        </Providers>
      </body>
    </html>
  );
}