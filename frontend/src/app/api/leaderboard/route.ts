import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api'

// GET /api/leaderboard - 获取积分排行榜
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const period = searchParams.get('period') || 'all' // all, week, month

    // 获取用户积分排行
    const leaderboard = await prisma.user.findMany({
      take: limit,
      orderBy: {
        pointHistory: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        _count: {
          select: {
            checkIns: true,
            plans: true,
          },
        },
      },
    })

    // 获取每个用户的总积分
    const leaderboardWithPoints = await Promise.all(
      leaderboard.map(async (user) => {
        const points = await prisma.pointHistory.aggregate({
          where: { userId: user.id },
          _sum: { points: true },
        })

        return {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          totalPoints: points._sum.points || 0,
          totalCheckIns: user._count.checkIns,
          totalPlans: user._count.plans,
        }
      })
    )

    // 按积分排序
    leaderboardWithPoints.sort((a, b) => b.totalPoints - a.totalPoints)

    // 添加排名
    const rankedLeaderboard = leaderboardWithPoints.map((user, index) => ({
      ...user,
      rank: index + 1,
    }))

    return successResponse({
      leaderboard: rankedLeaderboard,
      period,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    return serverErrorResponse(error)
  }
}