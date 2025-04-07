import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const { movieTmdbId } = await req.json();

  if (!session?.user?.email || !movieTmdbId)
    return NextResponse.json({ exists: false }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return NextResponse.json({ exists: false }, { status: 404 });

  const exists = await prisma.watchLater.findFirst({
    where: {
      userId: user.id,
      movieTmdbId,
    },
  });

  return NextResponse.json({ exists: !!exists });
}
