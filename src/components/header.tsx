"use client";

import Link from "next/link";
import { Menu, X, UserCircle } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 bg-[#2d3250] shadow-md z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-wide text-[#f9b17a] hover:text-[#f9c78b] transition duration-200"
        >
          ReelRate
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-white">
          <Link href="/" className="hover:text-[#f9b17a] transition">Home</Link>
          <Link href="/reviews" className="hover:text-[#f9b17a] transition">Avaliações</Link>

          {session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:text-[#f9b17a] transition"
              >
                <UserCircle className="w-5 h-5" />
                {session.user?.name}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[#424769] text-white rounded-xl shadow-lg overflow-hidden border border-[#676f9d]">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-[#2d3250] transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#2d3250] transition"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hover:text-[#f9b17a] transition">Login</Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#424769] border-t border-[#676f9d] px-6 py-4 space-y-4 text-white">
          <Link href="/" className="block hover:text-[#f9b17a]" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/reviews" className="block hover:text-[#f9b17a]" onClick={() => setMobileMenuOpen(false)}>Avaliações</Link>

          {session ? (
            <>
              <Link href="/profile" className="block hover:text-[#f9b17a]" onClick={() => setMobileMenuOpen(false)}>Perfil</Link>
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left hover:text-[#f9b17a]"
              >
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" className="block hover:text-[#f9b17a]" onClick={() => setMobileMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </header>
  );
}
