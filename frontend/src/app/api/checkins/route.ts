import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // 检查今天是否已打卡
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existing = await prisma.checkIn.findUnique({
      where: {
        planId_date: { planId, date: today },
      },
    })

    if (existing) {
      // 更新现有记录
      const updated = await prisma.checkIn.update({
        where: { id: existing.id },
        data: {
          completedAt: new Date(),
          note,
          duration: duration || existing.duration,
        },
      })
      return NextResponse.json({ checkIn: updated, updated: true })
    }

    // 创建新打卡记录
    const checkIn = await prisma.checkIn.create({
      data: {
        planId,
        userId,
        date: today,
        completedAt: new Date(),
        note,
        duration,
      },
    })

    // 增加积分
    await prisma.pointHistory.create({
      data: {
        userId,
        points: 10,
        reason: '完成打卡',
      },
    })

    return NextResponse.json({ checkIn, created: true, points: 10 })
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

    // 扣除积分
    await prisma.pointHistory.create({
      data: {
        userId: checkIn.userId,
        points: -10,
        reason: '取消打卡',
      },
    })

    return NextResponse.json({ success: true, points: -10 })
  } catch (error) {
    console.error('Delete check-in error:', error)
    return NextResponse.json({ error: '取消打卡失败' }, { status: 500 })
  }
}