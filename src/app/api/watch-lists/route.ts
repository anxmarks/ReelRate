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

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json(
            { error: "Usuário não autenticado" },
            { status: 401 }
        );
    }

    const { listId } = await req.json();

    if (!listId) {
        return NextResponse.json(
            { error: "ID da lista é obrigatório" },
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

        // Verifica se a lista pertence ao usuário
        const list = await prisma.watchList.findUnique({
            where: { id: listId },
        });

        if (!list || list.userId !== user.id) {
            return NextResponse.json(
                { error: "Lista não encontrada ou não pertence ao usuário" },
                { status: 403 }
            );
        }

        await prisma.watchList.delete({
            where: { id: listId },
        });

        return NextResponse.json({ message: "Lista deletada com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar lista:", error);
        return NextResponse.json(
            { error: "Falha ao deletar lista" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json(
            { error: "Usuário não autenticado" },
            { status: 401 }
        );
    }

    const { listId, nome, movieTmdbId } = await req.json();

    if (!listId || !nome) {
        return NextResponse.json(
            { error: "ID da lista e nome são obrigatórios" },
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

        // Verifica se a lista pertence ao usuário
        const list = await prisma.watchList.findUnique({
            where: { id: listId },
        });

        if (!list || list.userId !== user.id) {
            return NextResponse.json(
                { error: "Lista não encontrada ou não pertence ao usuário" },
                { status: 403 }
            );
        }

        const updatedList = await prisma.watchList.update({
            where: { id: listId },
            data: {
                nome,
                movieTmdbId: movieTmdbId || list.movieTmdbId,
            },
        });

        return NextResponse.json(updatedList);
    } catch (error) {
        console.error("Erro ao editar lista:", error);
        return NextResponse.json(
            { error: "Falha ao editar lista" },
            { status: 500 }
        );
    }
}