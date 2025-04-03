import Link from "next/link";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full fixed top-0 left-0 bg-black/80 backdrop-blur-md text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">ReelRate</Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/movies" className="hover:text-gray-300">Home</Link>
          <Link href="/reviews" className="hover:text-gray-300">Avaliações</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="hidden md:inline-block px-4 py-2 border border-white rounded">Entrar</button>
          <button className="hidden md:inline-block px-4 py-2 bg-white text-black rounded">Registrar</button>
          <Menu className="md:hidden w-6 h-6 cursor-pointer" />
        </div>
      </div>
    </header>
  );
}