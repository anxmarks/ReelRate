"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 bg-black/80 backdrop-blur-md text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">ReelRate</Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/movies" className="hover:text-gray-300">Home</Link>
          <Link href="/reviews" className="hover:text-gray-300">Avaliações</Link>
        </nav>
        <div className="flex items-center gap-4 relative">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="hover:text-gray-300"
              >
                {session.user?.name}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hover:text-gray-300">Login</Link>
          )}
          <Menu className="md:hidden w-6 h-6 cursor-pointer" />
        </div>
      </div>
    </header>
  );
}