import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { nome: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
      NOT: { email: session.user?.email || "" },
    },
    select: {
      id: true,
      nome: true,
      email: true,
      avatar: true,
    },
    take: 10,
  });

  const following = await prisma.follow.findMany({
    where: {
      follower: { email: session.user.email || "" },
      followingId: { in: users.map((user) => user.id) },
    },
    select: { followingId: true },
  });

  const followingIds = new Set(following.map((f) => f.followingId));

  const usersWithFollowingStatus = users.map((user) => ({
    ...user,
    isFollowing: followingIds.has(user.id),
  }));

  return NextResponse.json(usersWithFollowingStatus);
}