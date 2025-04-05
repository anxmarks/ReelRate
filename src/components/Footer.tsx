import { Mail, Github, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-tr from-[#2d3250] to-[#424769] text-white px-6 py-10 ">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* Logo e descrição */}
        <div>
          <h2 className="text-2xl font-bold text-[#f9b17a]">🎬 ReelRate</h2>
          <p className="text-sm text-[#cbd0e1] mt-2">
            Descubra, avalie e compartilhe seus filmes favoritos. Uma comunidade apaixonada por cinema.
          </p>
        </div>

        {/* Links úteis */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Links</h3>
          <ul className="space-y-2 text-[#d1d5e0] text-sm">
            <li><Link href="/" className="hover:text-[#f9b17a] transition">Início</Link></li>
            <li><Link href="/profile" className="hover:text-[#f9b17a] transition">Perfil</Link></li>
            <li><Link href="/login" className="hover:text-[#f9b17a] transition">Login</Link></li>
            <li><Link href="/register" className="hover:text-[#f9b17a] transition">Registrar</Link></li>
          </ul>
        </div>

        {/* Redes sociais */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Siga-nos</h3>
          <div className="flex gap-4 text-[#f9b17a]">
            <a href="mailto:contato@reelrate.com" className="hover:scale-110 transition">
              <Mail className="w-5 h-5" />
            </a>
            <a href="https://github.com/seu-usuario" target="_blank" className="hover:scale-110 transition">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://instagram.com/seu-usuario" target="_blank" className="hover:scale-110 transition">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#5e6280] mt-10 pt-6 text-center text-sm text-[#c1c3d1]">
        © {new Date().getFullYear()} ReelRate — Todos os direitos reservados.
      </div>
    </footer>
  );
}
