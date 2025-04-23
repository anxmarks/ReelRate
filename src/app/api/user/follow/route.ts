
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetUserId } = await req.json();
  const followerEmail = session.user?.email || "";

  const follower = await prisma.user.findUnique({ where: { email: followerEmail } });
  if (!follower || !targetUserId) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const existing = await prisma.follow.findFirst({
    where: {
      followerId: follower.id,
      followingId: targetUserId,
    },
  });

  if (existing) {
    return NextResponse.json({ message: "Already following" });
  }

  await prisma.follow.create({
    data: {
      followerId: follower.id,
      followingId: targetUserId,
    },
  });

  return NextResponse.json({ message: "Followed successfully" });
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const { targetUserId } = await req.json();
    const followerEmail = session.user?.email || "";
  
    const follower = await prisma.user.findUnique({ where: { email: followerEmail } });
    if (!follower || !targetUserId) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
  
    const existing = await prisma.follow.findFirst({
      where: {
        followerId: follower.id,
        followingId: targetUserId,
      },
    });
  
    if (!existing) {
      return NextResponse.json({ message: "Not following this user" }, { status: 400 });
    }
  
    await prisma.follow.delete({
      where: {
        id: existing.id,
      },
    });
  
    return NextResponse.json({ message: "Unfollowed successfully" });
  }