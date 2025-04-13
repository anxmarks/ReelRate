"use client";

import Footer from "@/components/Footer";
import Header from "@/components/header";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  
  return (
    <>
    <Header />
      <div className="flex min-h-screen items-center justify-center bg-[#2d3250] px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-[#424769] text-white shadow-xl rounded-2xl border border-[#676f9d]/30">
          <h1 className="text-3xl font-bold text-center text-white">Bem-vindo de volta</h1>
          {error && (<div className="text-red-400 text-center">{error}</div>)}
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const result = await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirect: false,
                callbackUrl: "/profile",
              });

              if (result?.error) {
                setError("Email ou senha incorretos.");
              } else {
                window.location.href = result?.url || "/profile";
              }
            }}
          >
            <input
              name="email"
              type="email"
              placeholder="E-mail"
              required
              className="w-full px-4 py-3 rounded-lg bg-[#2d3250] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f9b17a] border border-[#676f9d]/40"
            />
            <input
              name="password"
              type="password"
              placeholder="Senha"
              required
              className="w-full px-4 py-3 rounded-lg bg-[#2d3250] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f9b17a] border border-[#676f9d]/40"
            />
            <button
              type="submit"
              className="w-full bg-[#f9b17a] hover:bg-[#f8a95c] text-[#2d3250] font-bold py-3 rounded-lg transition"
            >
              Entrar
            </button>
          </form>

          <div className="flex items-center justify-center">
            <button
              onClick={() => signIn("google", { callbackUrl: "/profile" })}
              className="w-full bg-white text-[#2d3250] hover:bg-gray-100 font-semibold py-3 rounded-lg transition"
            >
              Entrar com Google
            </button>
          </div>

          <p className="text-sm text-center text-gray-300">
            Não possui conta?{" "}
            <Link href="/register" className="text-[#f9b17a] hover:underline">
              Registrar-se
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
