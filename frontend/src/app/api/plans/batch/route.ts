import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/plans/batch - 批量创建计划
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, plans } = body

    if (!userId || !Array.isArray(plans) || plans.length === 0) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    // 限制每次最多创建 20 个计划
    if (plans.length > 20) {
      return NextResponse.json({ error: '一次最多创建 20 个计划' }, { status: 400 })
    }

    // 批量创建
    const createdPlans = await Promise.all(
      plans.map(plan => 
        prisma.plan.create({
          data: {
            userId,
            title: plan.title,
            description: plan.description,
            category: plan.category || 'study',
            color: plan.color || '#3B82F6',
            startDate: new Date(plan.startDate || Date.now()),
            endDate: plan.endDate ? new Date(plan.endDate) : null,
            frequency: plan.frequency || 'daily',
            startTime: plan.startTime,
            endTime: plan.endTime,
          },
        })
      )
    )

    return NextResponse.json({
      success: true,
      count: createdPlans.length,
      plans: createdPlans,
    })
  } catch (error) {
    console.error('Batch create error:', error)
    return NextResponse.json({ error: '批量创建失败' }, { status: 500 })
  }
}