import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        points: {
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    const totalPoints = user.points.reduce((sum, p) => sum + p.points, 0)

    return NextResponse.json({
      totalPoints,
      history: user.points
    })
  } catch (error) {
    console.error('获取积分失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}