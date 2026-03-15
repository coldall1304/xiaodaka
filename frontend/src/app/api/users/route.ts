import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/users - 获取用户列表（多用户管理）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const currentUserId = searchParams.get('currentUserId')

    if (!currentUserId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 })
    }

    // 获取当前用户的所有关联用户
    // 这里简化处理，实际应该有用户关联表
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { id: currentUserId },
          // 可以添加更多关联逻辑
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json({ error: '获取用户列表失败' }, { status: 500 })
  }
}

// POST /api/users/switch - 切换用户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Switch user error:', error)
    return NextResponse.json({ error: '切换用户失败' }, { status: 500 })
  }
}