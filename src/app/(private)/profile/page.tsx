"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p className="text-center text-gray-600">Carregando...</p>;
  }

  const userImage = session?.user?.image || "/default-profile.jpg";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        <img
          src={userImage}
          alt="User Profile"
          className="w-24 h-24 rounded-full mx-auto border-2 border-gray-300"
        />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Bem-vindo, {session?.user?.name}
        </h1>
        <p className="text-gray-600">{session?.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Sair
        </button>
      </div>
    </div>
  );
}