import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/membership - 获取会员信息
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 })
    }

    const membership = await prisma.membership.findUnique({
      where: { userId },
    })

    if (!membership) {
      // 创建默认免费会员
      const newMembership = await prisma.membership.create({
        data: { userId, type: 'free' },
      })
      return NextResponse.json({ membership: newMembership })
    }

    // 检查是否过期
    if (membership.endDate && new Date() > membership.endDate) {
      const updated = await prisma.membership.update({
        where: { id: membership.id },
        data: { isActive: false, type: 'free' },
      })
      return NextResponse.json({ membership: updated, expired: true })
    }

    // 计算剩余天数
    let daysRemaining = 0
    if (membership.endDate) {
      const diff = membership.endDate.getTime() - Date.now()
      daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    }

    return NextResponse.json({
      membership,
      daysRemaining,
    })
  } catch (error) {
    console.error('Get membership error:', error)
    return NextResponse.json({ error: '获取会员信息失败' }, { status: 500 })
  }
}

// POST /api/membership - 兑换会员码
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, code } = body

    if (!userId || !code) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    // 查找会员码
    const membershipCode = await prisma.membershipCode.findUnique({
      where: { code },
    })

    if (!membershipCode) {
      return NextResponse.json({ error: '会员码不存在' }, { status: 404 })
    }

    if (membershipCode.isUsed) {
      return NextResponse.json({ error: '会员码已被使用' }, { status: 400 })
    }

    if (membershipCode.expiresAt && new Date() > membershipCode.expiresAt) {
      return NextResponse.json({ error: '会员码已过期' }, { status: 400 })
    }

    // 获取当前会员信息
    let membership = await prisma.membership.findUnique({
      where: { userId },
    })

    // 计算新的结束日期
    let newEndDate = new Date()
    if (membership?.endDate && new Date() < membership.endDate) {
      newEndDate = new Date(membership.endDate)
    }
    newEndDate.setDate(newEndDate.getDate() + membershipCode.durationDays)

    // 更新或创建会员
    if (membership) {
      membership = await prisma.membership.update({
        where: { id: membership.id },
        data: {
          type: membershipCode.type,
          endDate: newEndDate,
          isActive: true,
        },
      })
    } else {
      membership = await prisma.membership.create({
        data: {
          userId,
          type: membershipCode.type,
          endDate: newEndDate,
          isActive: true,
        },
      })
    }

    // 标记会员码已使用
    await prisma.membershipCode.update({
      where: { id: membershipCode.id },
      data: {
        isUsed: true,
        usedBy: userId,
        usedAt: new Date(),
      },
    })

    const daysRemaining = Math.ceil(
      (newEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )

    return NextResponse.json({
      success: true,
      membership,
      daysRemaining,
      message: `成功兑换 ${membershipCode.durationDays} 天会员`,
    })
  } catch (error) {
    console.error('Redeem membership error:', error)
    return NextResponse.json({ error: '兑换失败' }, { status: 500 })
  }
}