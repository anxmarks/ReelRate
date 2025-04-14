"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import { FcGoogle } from "react-icons/fc";

export default function Register() {
  const { data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      router.push("/profile");
    }
  }, [session, router]);

  if (session) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
        name: formData.get("name"),
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      router.push("/login");
    } else {
      const data = await response.json();
      setError(data.message || "Erro ao registrar.");
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2d3250] to-[#1a1f38] px-4 py-12">
        <div className="w-full max-w-md p-8 space-y-6 bg-[#424769]/80 backdrop-blur-sm text-white shadow-2xl rounded-2xl border border-[#676f9d]/30">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Criar nova conta
            </h1>
            <p className="mt-2 text-gray-300">Junte-se à nossa comunidade</p>
          </div>

          {error && (
            <div className="p-3 text-center text-red-400 bg-red-900/30 rounded-lg border border-red-700/50">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <input
                name="name"
                type="text"
                placeholder="Nome completo"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#2d3250] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 border border-[#676f9d]/40 transition"
              />
              <input
                name="email"
                type="email"
                placeholder="E-mail"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#2d3250] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 border border-[#676f9d]/40 transition"
              />
              <input
                name="password"
                type="password"
                placeholder="Senha"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#2d3250] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 border border-[#676f9d]/40 transition"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer text-white w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-[#2d3250] font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-amber-500/20"
            >
              Criar conta
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="text-sm text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          <p className="text-sm text-center text-gray-400">
            Já possui uma conta?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer hover:underline transition-colors"
            >
              Fazer login
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}