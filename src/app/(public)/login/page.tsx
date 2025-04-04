"use client";

import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold text-center text-gray-900">Login</h1>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            signIn("credentials", {
              email: formData.get("email"),
              password: formData.get("password"),
              redirect: true,
              callbackUrl: "/dashboard",
            });
          }}
        >
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Senha"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Entrar
          </button>
        </form>
        <div className="flex items-center justify-center">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Entrar com Google
          </button>
        </div>
      </div>
    </div>
  );
}
