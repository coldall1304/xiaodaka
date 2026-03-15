import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

// GET - 获取用户愿望列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    const wishes = await prisma.wishList.findMany({
      where: { userId: user.id },
      orderBy: [{ isCompleted: 'asc' }, { createdAt: 'desc' }]
    })

    return NextResponse.json({ wishes })
  } catch (error) {
    console.error('获取愿望列表失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// POST - 创建新愿望
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, points, icon } = body

    if (!title || !points) {
      return NextResponse.json({ error: '标题和积分不能为空' }, { status: 400 })
    }

    const wish = await prisma.wishList.create({
      data: {
        userId: user.id,
        title,
        description: description || null,
        points: parseInt(points),
        icon: icon || '🎁'
      }
    })

    return NextResponse.json({ wish })
  } catch (error) {
    console.error('创建愿望失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// DELETE - 删除愿望
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '愿望ID不能为空' }, { status: 400 })
    }

    // 验证是用户的愿望
    const wish = await prisma.wishList.findFirst({
      where: { id, userId: user.id }
    })

    if (!wish) {
      return NextResponse.json({ error: '愿望不存在' }, { status: 404 })
    }

    await prisma.wishList.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除愿望失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}