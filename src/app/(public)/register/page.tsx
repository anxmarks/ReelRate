"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/Footer";

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
      <div className="flex min-h-screen items-center justify-center bg-[#2d3250] px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-[#424769] text-white shadow-xl rounded-2xl border border-[#676f9d]/30">
          <h1 className="text-3xl font-bold text-center">Criar conta</h1>
          {error && <p className="text-red-400 text-center">{error}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              placeholder="Nome"
              required
              className="w-full px-4 py-3 rounded-lg bg-[#2d3250] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f9b17a] border border-[#676f9d]/40"
            />
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
              Registrar
            </button>
          </form>
          <p className="text-sm text-center text-gray-300">
            Já possui uma conta?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-[#f9b17a] cursor-pointer hover:underline"
            >
              Entrar
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
