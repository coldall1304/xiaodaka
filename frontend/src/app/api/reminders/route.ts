import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api'

// GET /api/reminders - 获取用户提醒列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return errorResponse('缺少用户ID')
    }

    // 获取需要提醒的计划
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    const reminders = await prisma.plan.findMany({
      where: {
        userId,
        isActive: true,
        reminderTime: currentTime,
      },
      select: {
        id: true,
        title: true,
        category: true,
        reminderTime: true,
      },
    })

    return successResponse({
      reminders,
      currentTime,
      count: reminders.length,
    })
  } catch (error) {
    console.error('Get reminders error:', error)
    return serverErrorResponse(error)
  }
}

// POST /api/reminders - 发送提醒通知
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, planId, message } = body

    // TODO: 集成推送通知服务
    // 目前只记录日志

    console.log(`[Reminder] User: ${userId}, Plan: ${planId}, Message: ${message}`)

    return successResponse({
      sent: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Send reminder error:', error)
    return serverErrorResponse(error)
  }
}