import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/stats/detail - 获取详细统计数据（图表数据）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const range = searchParams.get('range') || '7days'

    if (!userId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 })
    }

    // 计算时间范围
    const days = range === '30days' ? 30 : 7
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)

    // 获取用户计划
    const plans = await prisma.plan.findMany({
      where: { userId, isActive: true },
    })

    // 获取时间范围内的打卡记录
    const checkIns = await prisma.checkIn.findMany({
      where: {
        userId,
        date: { gte: startDate },
      },
      include: {
        plan: { select: { category: true, duration: true } },
      },
    })

    // 生成图表数据
    const chartData = []
    const dayNames = ['日', '一', '二', '三', '四', '五', '六']
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const dayCheckIns = checkIns.filter(c => {
        const checkDate = new Date(c.date)
        checkDate.setHours(0, 0, 0, 0)
        return checkDate.getTime() === date.getTime()
      })

      const completedTasks = dayCheckIns.length
      const totalTasks = plans.length // 简化：用当前计划数
      const actualTime = dayCheckIns.reduce((sum, c) => sum + (c.duration || 30), 0)
      const plannedTime = plans.reduce((sum, p) => sum + (p.duration || 60), 0)

      // 分类时间
      const studyTime = dayCheckIns
        .filter(c => ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治', '道德与法治', '信息技术'].includes(c.plan?.category || ''))
        .reduce((sum, c) => sum + (c.duration || 30), 0)
      
      const exerciseTime = dayCheckIns
        .filter(c => c.plan?.category === '运动')
        .reduce((sum, c) => sum + (c.duration || 30), 0)
      
      const entertainmentTime = dayCheckIns
        .filter(c => c.plan?.category === '娱乐')
        .reduce((sum, c) => sum + (c.duration || 30), 0)
      
      const otherTime = actualTime - studyTime - exerciseTime - entertainmentTime

      chartData.push({
        day: `周${dayNames[date.getDay()]}`,
        plannedTime,
        actualTime,
        completedTasks,
        totalTasks,
        studyTime,
        exerciseTime,
        entertainmentTime,
        otherTime: Math.max(0, otherTime),
      })
    }

    // 分类统计
    const categoryMap = new Map<string, { time: number; count: number }>()
    
    checkIns.forEach(c => {
      const cat = c.plan?.category || '其他'
      const existing = categoryMap.get(cat) || { time: 0, count: 0 }
      categoryMap.set(cat, {
        time: existing.time + (c.duration || 30),
        count: existing.count + 1,
      })
    })

    const categoryStats = Array.from(categoryMap.entries())
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.time - a.time)

    // 完成时间段分布
    const hourMap = new Map<number, number>()
    checkIns.forEach(c => {
      if (c.completedAt) {
        const hour = new Date(c.completedAt).getHours()
        hourMap.set(hour, (hourMap.get(hour) || 0) + 1)
      }
    })

    const completionTimeDistribution = Array.from(hourMap.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour - b.hour)

    // 总体统计
    const totalTasks = plans.length
    const completedTasks = checkIns.filter(c => c.completedAt).length
    const totalMinutes = checkIns.reduce((sum, c) => sum + (c.duration || 30), 0)
    const totalHours = totalMinutes / 60
    const avgDailyHours = totalHours / days
    const avgCompletionRate = totalTasks > 0 ? Math.round((completedTasks / (totalTasks * days)) * 100) : 0

    // 最活跃的一天
    const dayTotals = chartData.map(d => ({ day: d.day, total: d.actualTime }))
    const mostActiveDay = dayTotals.sort((a, b) => b.total - a.total)[0]?.day || '无'

    return NextResponse.json({
      totalTasks,
      completedTasks,
      avgCompletionRate,
      totalHours: Math.round(totalHours * 10) / 10,
      avgDailyHours: Math.round(avgDailyHours * 10) / 10,
      mostActiveDay,
      chartData,
      categoryStats,
      completionTimeDistribution,
    })
  } catch (error) {
    console.error('Get detail stats error:', error)
    return NextResponse.json({ error: '获取详细统计失败' }, { status: 500 })
  }
}