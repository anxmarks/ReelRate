"use client";

import Footer from "@/components/Footer";
import Header from "@/components/header";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      router.push("/profile");
    }
  }, [session, router]);

  if (session) return null;

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2d3250] to-[#1a1f38] px-4 py-12">
        <div className="w-full max-w-md p-8 space-y-6 bg-[#424769]/80 backdrop-blur-sm text-white shadow-2xl rounded-2xl border border-[#676f9d]/30">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Bem-vindo de volta
            </h1>
            <p className="mt-2 text-gray-300">Entre para acessar sua conta</p>
          </div>
          
          {error && (
            <div className="p-3 text-center text-red-400 bg-red-900/30 rounded-lg border border-red-700/50">
              {error}
            </div>
          )}

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
            <div className="space-y-3">
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
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 cursor-pointer text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-amber-500/20"
            >
              Entrar
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="text-sm text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/profile" })}
            className="w-full flex items-center cursor-pointer justify-center gap-3 bg-white/90 hover:bg-white text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-300 border border-gray-300 hover:shadow-lg"
          >
            <FcGoogle className="text-xl" />
            <span>Entrar com Google</span>
          </button>

          <p className="text-sm text-center text-gray-400">
            Não possui conta?{" "}
            <Link 
              href="/register" 
              className="text-amber-400 hover:text-amber-300 font-medium hover:underline transition-colors"
            >
              Registrar-se
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}