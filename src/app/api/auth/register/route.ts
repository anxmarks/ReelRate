import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return new Response(JSON.stringify({ message: "Todos os campos são obrigatórios." }), { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "E-mail já registrado." }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, nome: name, senha: hashedPassword },
    });

    return new Response(JSON.stringify({ message: "Usuário registrado com sucesso." }), { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return new Response(JSON.stringify({ message: "Erro interno do servidor." }), { status: 500 });
  }
}
