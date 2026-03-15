import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// POST /api/auth/register - 用户注册
export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // 验证输入
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '请填写完整信息' },
        { status: 400 }
      )
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      )
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    // 给新用户赠送初始积分
    await prisma.pointHistory.create({
      data: {
        userId: user.id,
        points: 100,
        reason: '新用户注册奖励',
      },
    })

    // 给新用户赠送2天会员试用
    const membershipEndDate = new Date()
    membershipEndDate.setDate(membershipEndDate.getDate() + 2)

    await prisma.membership.create({
      data: {
        userId: user.id,
        type: 'trial',
        endDate: membershipEndDate,
        isActive: true,
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: '注册失败，请重试' },
      { status: 500 }
    )
  }
}