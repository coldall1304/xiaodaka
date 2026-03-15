import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/stats - 获取用户统计数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 })
    }

    // 获取总打卡次数
    const totalCheckIns = await prisma.checkIn.count({
      where: { userId },
    })

    // 获取总积分
    const totalPoints = await prisma.pointHistory.aggregate({
      where: { userId },
      _sum: { points: true },
    })

    // 获取活跃计划数
    const activePlans = await prisma.plan.count({
      where: { userId, isActive: true },
    })

    // 获取今日打卡
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayCheckIns = await prisma.checkIn.count({
      where: {
        userId,
        date: { gte: today },
      },
    })

    // 计算当前连续打卡天数
    const checkIns = await prisma.checkIn.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      select: { date: true },
      distinct: ['date'],
    })

    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    let lastDate: Date | null = null

    for (const checkIn of checkIns) {
      const checkDate = new Date(checkIn.date)
      checkDate.setHours(0, 0, 0, 0)

      if (lastDate === null) {
        tempStreak = 1
      } else {
        const diffDays = Math.floor((lastDate.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays === 1) {
          tempStreak++
        } else {
          if (tempStreak > longestStreak) longestStreak = tempStreak
          tempStreak = 1
        }
      }

      lastDate = checkDate
    }

    if (tempStreak > longestStreak) longestStreak = tempStreak

    // 检查今天是否打卡，计算当前连续天数
    const firstCheckIn = checkIns[0]
    if (firstCheckIn) {
      const firstDate = new Date(firstCheckIn.date)
      firstDate.setHours(0, 0, 0, 0)
      const todayDiff = Math.floor((today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24))
      if (todayDiff <= 1) {
        currentStreak = tempStreak
      }
    }

    // 获取本周学习时间
    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
    weekStart.setHours(0, 0, 0, 0)

    const weekCheckIns = await prisma.checkIn.findMany({
      where: {
        userId,
        date: { gte: weekStart },
        duration: { not: null },
      },
      select: { duration: true },
    })

    const weekStudyTime = weekCheckIns.reduce((sum, c) => sum + (c.duration || 0), 0)

    return NextResponse.json({
      totalCheckIns,
      totalPoints: totalPoints._sum.points || 0,
      activePlans,
      todayCheckIns,
      currentStreak,
      longestStreak,
      weekStudyTime,
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json({ error: '获取统计失败' }, { status: 500 })
  }
}