import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    return NextResponse.json({ error: "Erro ao buscar avaliações" }, { status: 500 });
  }
}
