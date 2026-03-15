import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/plans - 获取用户的学习计划列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 })
    }

    const plans = await prisma.plan.findMany({
      where: { userId, isActive: true },
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

    return NextResponse.json({ plans })
  } catch (error) {
    console.error('Get plans error:', error)
    return NextResponse.json({ error: '获取计划失败' }, { status: 500 })
  }
}

// POST /api/plans - 创建新的学习计划
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      userId, 
      title, 
      description, 
      category, 
      color, 
      startDate, 
      endDate, 
      frequency, 
      customDays, 
      reminderTime,
      startTime,
      endTime 
    } = body

    if (!userId || !title) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    const plan = await prisma.plan.create({
      data: {
        userId,
        title,
        description,
        category: category || 'study',
        color: color || '#3B82F6',
        startDate: new Date(startDate || Date.now()),
        endDate: endDate ? new Date(endDate) : null,
        frequency: frequency || 'daily',
        customDays,
        reminderTime,
        startTime,
        endTime,
      },
    })

    return NextResponse.json({ plan })
  } catch (error) {
    console.error('Create plan error:', error)
    return NextResponse.json({ error: '创建计划失败' }, { status: 500 })
  }
}

// PATCH /api/plans - 更新学习计划
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, ...updates } = body

    if (!planId) {
      return NextResponse.json({ error: '缺少计划ID' }, { status: 400 })
    }

    const plan = await prisma.plan.update({
      where: { id: planId },
      data: updates,
    })

    return NextResponse.json({ plan })
  } catch (error) {
    console.error('Update plan error:', error)
    return NextResponse.json({ error: '更新计划失败' }, { status: 500 })
  }
}

// DELETE /api/plans - 删除学习计划（软删除）
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const planId = searchParams.get('planId')

    if (!planId) {
      return NextResponse.json({ error: '缺少计划ID' }, { status: 400 })
    }

    await prisma.plan.update({
      where: { id: planId },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete plan error:', error)
    return NextResponse.json({ error: '删除计划失败' }, { status: 500 })
  }
}