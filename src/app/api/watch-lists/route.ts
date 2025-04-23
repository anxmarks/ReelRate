import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json(
            { error: "Usuário não autenticado" },
            { status: 401 }
        );
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 }
            );
        }

        // Busca todas as listas do usuário
        const watchLists = await prisma.watchList.findMany({
            where: { userId: user.id },
            select: {
                id: true,
                nome: true,
                movieTmdbId: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(watchLists);
    } catch (error) {
        console.error("Erro ao buscar listas:", error);
        return NextResponse.json(
            { error: "Falha ao buscar listas" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const { nome, movieTmdbId } = await req.json();

    if (!session?.user?.email || !nome) {
        return NextResponse.json(
            { error: "Dados incompletos para criar lista" },
            { status: 400 }
        );
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 }
            );
        }

        const newList = await prisma.watchList.create({
            data: {
                userId: user.id,
                nome,
                movieTmdbId: movieTmdbId || [],
            },
        });

        return NextResponse.json(newList, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar lista:", error);
        return NextResponse.json(
            { error: "Falha ao criar lista" },
            { status: 500 }
        );
    }
}