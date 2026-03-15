import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

// POST - 用积分兑换愿望
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        points: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    const body = await request.json()
    const { wishId } = body

    if (!wishId) {
      return NextResponse.json({ error: '愿望ID不能为空' }, { status: 400 })
    }

    // 获取愿望
    const wish = await prisma.wishList.findFirst({
      where: { id: wishId, userId: user.id, isCompleted: false }
    })

    if (!wish) {
      return NextResponse.json({ error: '愿望不存在或已完成' }, { status: 404 })
    }

    // 计算用户当前积分
    const totalPoints = user.points.reduce((sum, p) => sum + p.points, 0)

    if (totalPoints < wish.points) {
      return NextResponse.json({ 
        error: '积分不足',
        currentPoints: totalPoints,
        requiredPoints: wish.points
      }, { status: 400 })
    }

    // 使用事务处理
    await prisma.$transaction([
      // 扣除积分
      prisma.pointHistory.create({
        data: {
          userId: user.id,
          points: -wish.points,
          reason: `兑换愿望: ${wish.title}`,
          relatedId: wish.id
        }
      }),
      // 标记愿望完成
      prisma.wishList.update({
        where: { id: wish.id },
        data: {
          isCompleted: true,
          completedAt: new Date()
        }
      })
    ])

    return NextResponse.json({ 
      success: true,
      message: `恭喜！你已兑换「${wish.title}」`
    })
  } catch (error) {
    console.error('兑换愿望失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}