import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 成就定义
const ACHIEVEMENTS = [
  { id: 'first_checkin', icon: '🌟', title: '新手启程', desc: '完成第一次打卡', points: 10, condition: { type: 'checkins', value: 1 } },
  { id: 'streak_7', icon: '🔥', title: '连续7天', desc: '连续打卡7天', points: 50, condition: { type: 'streak', value: 7 } },
  { id: 'streak_30', icon: '💪', title: '坚持者', desc: '连续打卡30天', points: 200, condition: { type: 'streak', value: 30 } },
  { id: 'study_100h', icon: '📚', title: '学霸', desc: '累计学习100小时', points: 300, condition: { type: 'study_hours', value: 100 } },
  { id: 'exercise_50h', icon: '🏃', title: '运动达人', desc: '累计运动50小时', points: 200, condition: { type: 'exercise_hours', value: 50 } },
  { id: 'early_bird', icon: '🌅', title: '早起鸟', desc: '连续30天早起打卡', points: 150, condition: { type: 'early_streak', value: 30 } },
  { id: 'reader', icon: '📖', title: '阅读者', desc: '累计阅读50天', points: 100, condition: { type: 'reading_days', value: 50 } },
  { id: 'streak_100', icon: '🏆', title: '百日王者', desc: '连续打卡100天', points: 500, condition: { type: 'streak', value: 100 } },
]

// GET /api/achievements - 获取用户的成就列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 })
    }

    // 获取用户统计
    const totalCheckIns = await prisma.checkIn.count({ where: { userId } })
    
    const pointHistory = await prisma.pointHistory.aggregate({
      where: { userId },
      _sum: { points: true },
    })
    const totalPoints = pointHistory._sum.points || 0

    // 计算最长连续天数
    const checkIns = await prisma.checkIn.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      select: { date: true },
      distinct: ['date'],
    })

    let longestStreak = 0
    let currentStreak = 0
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

    // 检查今天是否打卡
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const firstCheckIn = checkIns[0]
    if (firstCheckIn) {
      const firstDate = new Date(firstCheckIn.date)
      firstDate.setHours(0, 0, 0, 0)
      const todayDiff = Math.floor((today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24))
      if (todayDiff <= 1) {
        currentStreak = tempStreak
      }
    }

    // 计算成就进度
    const achievementsWithProgress = ACHIEVEMENTS.map(achievement => {
      let unlocked = false
      let progress = 0
      let total = achievement.condition.value

      switch (achievement.condition.type) {
        case 'checkins':
          progress = totalCheckIns
          unlocked = totalCheckIns >= total
          break
        case 'streak':
          progress = currentStreak
          unlocked = currentStreak >= total
          break
        default:
          progress = 0
          unlocked = false
      }

      return {
        ...achievement,
        unlocked,
        progress: Math.min(progress, total),
        total,
      }
    })

    const unlockedCount = achievementsWithProgress.filter(a => a.unlocked).length

    return NextResponse.json({
      achievements: achievementsWithProgress,
      stats: {
        totalPoints,
        totalCheckIns,
        currentStreak,
        longestStreak,
        unlockedCount,
        totalAchievements: ACHIEVEMENTS.length,
      },
    })
  } catch (error) {
    console.error('Get achievements error:', error)
    return NextResponse.json({ error: '获取成就失败' }, { status: 500 })
  }
}