import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/habits - 获取用户的习惯列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 })
    }

    // 习惯本质上也是一种计划，category 为 'habit'
    const habits = await prisma.plan.findMany({
      where: { 
        userId, 
        category: 'habit',
        isActive: true 
      },
      orderBy: { createdAt: 'desc' },
      include: {
        checkIns: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        },
      },
    })

    // 计算连续天数
    const habitsWithStreak = await Promise.all(habits.map(async (habit) => {
      const checkIns = await prisma.checkIn.findMany({
        where: { planId: habit.id },
        orderBy: { date: 'desc' },
        select: { date: true },
        distinct: ['date'],
        take: 365,
      })

      let streak = 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      for (let i = 0; i < checkIns.length; i++) {
        const checkDate = new Date(checkIns[i].date)
        checkDate.setHours(0, 0, 0, 0)
        
        const expectedDate = new Date(today)
        expectedDate.setDate(today.getDate() - i)

        if (checkDate.getTime() === expectedDate.getTime()) {
          streak++
        } else {
          break
        }
      }

      return {
        ...habit,
        streak,
        todayCompleted: habit.checkIns.length > 0,
      }
    }))

    return NextResponse.json({ habits: habitsWithStreak })
  } catch (error) {
    console.error('Get habits error:', error)
    return NextResponse.json({ error: '获取习惯失败' }, { status: 500 })
  }
}

// POST /api/habits - 创建新习惯
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, color, reminderTime } = body

    if (!userId || !title) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    const habit = await prisma.plan.create({
      data: {
        userId,
        title,
        category: 'habit',
        color: color || '#8B5CF6',
        startDate: new Date(),
        frequency: 'daily',
        reminderTime,
      },
    })

    return NextResponse.json({ habit })
  } catch (error) {
    console.error('Create habit error:', error)
    return NextResponse.json({ error: '创建习惯失败' }, { status: 500 })
  }
}