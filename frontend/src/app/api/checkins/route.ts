import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 计算积分
function calculatePoints(
  completedAt: Date,
  duration?: number | null,
  startTime?: string | null
): number {
  let points = 1 // 基础积分：1星

  // 时间奖励
  if (duration) {
    if (duration >= 60) {
      points += 2 // 60分钟+2星
    } else if (duration >= 30) {
      points += 1 // 30分钟+1星
    }
  }

  // 早起加成（6:00-8:00）
  const hour = completedAt.getHours()
  if (hour >= 6 && hour < 8) {
    points = Math.round(points * 1.2) // ×1.2倍
  }

  // 周末加成
  const dayOfWeek = completedAt.getDay()
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    points = Math.round(points * 1.5) // ×1.5倍
  }

  // 如果计划设置了开始时间，检查是否按时开始（额外奖励）
  if (startTime) {
    const [startHour, startMin] = startTime.split(':').map(Number)
    const startMinutes = startHour * 60 + startMin
    const completedMinutes = hour * 60 + completedAt.getMinutes()
    const diff = Math.abs(completedMinutes - startMinutes)
    
    if (diff <= 30) { // 30分钟内打卡，额外奖励
      points += 1
    }
  }

  return points
}

// GET /api/checkins - 获取打卡记录
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const planId = searchParams.get('planId')
    const date = searchParams.get('date')

    if (!userId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 })
    }

    const where: any = { userId }
    if (planId) where.planId = planId
    if (date) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      where.date = { gte: startOfDay, lte: endOfDay }
    }

    const checkIns = await prisma.checkIn.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { plan: true },
    })

    return NextResponse.json({ checkIns })
  } catch (error) {
    console.error('Get check-ins error:', error)
    return NextResponse.json({ error: '获取打卡记录失败' }, { status: 500 })
  }
}

// POST /api/checkins - 创建打卡记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, userId, note, duration } = body

    if (!planId || !userId) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    // 获取计划信息
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    })

    if (!plan) {
      return NextResponse.json({ error: '计划不存在' }, { status: 404 })
    }

    // 检查今天是否已打卡
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existing = await prisma.checkIn.findUnique({
      where: {
        planId_date: { planId, date: today },
      },
    })

    const completedAt = new Date()

    if (existing) {
      // 更新现有记录
      const updated = await prisma.checkIn.update({
        where: { id: existing.id },
        data: {
          completedAt,
          note,
          duration: duration || existing.duration,
        },
      })

      // 重新计算积分
      const points = calculatePoints(completedAt, duration || existing.duration, plan.startTime)

      return NextResponse.json({ 
        checkIn: updated, 
        updated: true,
        points,
        pointsDetail: {
          base: 1,
          timeBonus: duration && duration >= 30 ? (duration >= 60 ? 2 : 1) : 0,
          earlyBird: completedAt.getHours() >= 6 && completedAt.getHours() < 8,
          weekend: completedAt.getDay() === 0 || completedAt.getDay() === 6,
          onTime: plan.startTime ? true : false,
        }
      })
    }

    // 计算积分
    const points = calculatePoints(completedAt, duration, plan.startTime)

    // 创建新打卡记录
    const checkIn = await prisma.checkIn.create({
      data: {
        planId,
        userId,
        date: today,
        completedAt,
        note,
        duration,
      },
    })

    // 增加积分
    await prisma.pointHistory.create({
      data: {
        userId,
        points,
        reason: '完成打卡',
        relatedId: checkIn.id,
      },
    })

    return NextResponse.json({ 
      checkIn, 
      created: true, 
      points,
      pointsDetail: {
        base: 1,
        timeBonus: duration && duration >= 30 ? (duration >= 60 ? 2 : 1) : 0,
        earlyBird: completedAt.getHours() >= 6 && completedAt.getHours() < 8,
        weekend: completedAt.getDay() === 0 || completedAt.getDay() === 6,
        onTime: plan.startTime ? true : false,
      }
    })
  } catch (error) {
    console.error('Create check-in error:', error)
    return NextResponse.json({ error: '打卡失败' }, { status: 500 })
  }
}

// DELETE /api/checkins - 取消打卡
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const checkInId = searchParams.get('checkInId')

    if (!checkInId) {
      return NextResponse.json({ error: '缺少打卡ID' }, { status: 400 })
    }

    // 获取打卡记录信息
    const checkIn = await prisma.checkIn.findUnique({
      where: { id: checkInId },
    })

    if (!checkIn) {
      return NextResponse.json({ error: '打卡记录不存在' }, { status: 404 })
    }

    // 删除打卡记录
    await prisma.checkIn.delete({
      where: { id: checkInId },
    })

    // 扣除积分（假设固定扣除，实际应该记录原始积分）
    await prisma.pointHistory.create({
      data: {
        userId: checkIn.userId,
        points: -10,
        reason: '取消打卡',
        relatedId: checkInId,
      },
    })

    return NextResponse.json({ success: true, points: -10 })
  } catch (error) {
    console.error('Delete check-in error:', error)
    return NextResponse.json({ error: '取消打卡失败' }, { status: 500 })
  }
}