import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        avatar: true,
        checkIns: { select: { id: true } },
        plans: { select: { id: true } },
      },
    })

    const leaderboard = users.map((user, index) => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      totalCheckIns: user.checkIns.length,
      totalPlans: user.plans.length,
      totalPoints: 0,
      rank: index + 1,
    }))

    return NextResponse.json({ leaderboard })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
