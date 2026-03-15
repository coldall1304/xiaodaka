'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

interface ChartData {
  day: string
  plannedTime: number
  actualTime: number
  completedTasks: number
  totalTasks: number
  studyTime: number
  exerciseTime: number
  entertainmentTime: number
  otherTime: number
}

interface CategoryStats {
  category: string
  time: number
  count: number
}

interface Stats {
  totalTasks: number
  completedTasks: number
  avgCompletionRate: number
  totalHours: number
  avgDailyHours: number
  mostActiveDay: string
  chartData: ChartData[]
  categoryStats: CategoryStats[]
  completionTimeDistribution: { hour: number; count: number }[]
}

export default function StatsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    avgCompletionRate: 0,
    totalHours: 0,
    avgDailyHours: 0,
    mostActiveDay: '无',
    chartData: [],
    categoryStats: [],
    completionTimeDistribution: []
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7days')

  useEffect(() => {
    if (user?.id) {
      setLoading(true)
      fetch(`/api/stats/detail?userId=${user.id}&range=${timeRange}`)
        .then(res => res.json())
        .then(data => {
          setStats(data)
        })
        .catch(err => console.error('Failed to fetch stats:', err))
        .finally(() => setLoading(false))
    }
  }, [user?.id, timeRange])

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h${mins}m` : `${hours}h`
  }

  const getMaxValue = (data: ChartData[], key: keyof ChartData) => {
    return Math.max(...data.map(d => d[key] as number), 1)
  }

  const categoryColors: Record<string, string> = {
    '语文': 'bg-blue-500',
    '数学': 'bg-green-500',
    '英语': 'bg-purple-500',
    '物理': 'bg-orange-500',
    '化学': 'bg-red-500',
    '生物': 'bg-teal-500',
    '历史': 'bg-yellow-500',
    '地理': 'bg-cyan-500',
    '政治': 'bg-pink-500',
    '运动': 'bg-emerald-500',
    '娱乐': 'bg-indigo-500',
    '技能': 'bg-amber-500',
    '其他': 'bg-gray-500',
  }

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || 'bg-gray-400'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600">加载统计数据...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-primary text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-white/80 hover:text-white">
                ← 返回
              </Link>
              <div>
                <h1 className="text-2xl font-bold">图表统计 📊</h1>
                <p className="text-white/80 text-sm mt-1">查看学习进度和成效分析</p>
              </div>
            </div>
          </div>

          {/* Time Range Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                timeRange === '7days'
                  ? 'bg-white text-primary-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              最近7天
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                timeRange === '30days'
                  ? 'bg-white text-primary-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              最近30天
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* AI Analysis Card */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span>🤖</span>
                AI 近七日打卡分析
              </h3>
              <p className="text-white/80 text-sm mt-1">近七日 · 点击生成分析</p>
            </div>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition">
              生成分析
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-gray-500 text-sm">总任务数</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTasks}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-gray-500 text-sm">已完成</div>
            <div className="text-3xl font-bold text-green-500 mt-2">{stats.completedTasks}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-gray-500 text-sm">平均完成率</div>
            <div className="text-3xl font-bold text-primary-600 mt-2">{stats.avgCompletionRate}%</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-gray-500 text-sm">总时长</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{formatTime(stats.totalHours * 60)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-gray-500 text-sm">日均时长</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{formatTime(stats.avgDailyHours * 60)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-gray-500 text-sm">最活跃</div>
            <div className="text-3xl font-bold text-orange-500 mt-2">{stats.mostActiveDay}</div>
          </div>
        </div>

        {/* Charts */}
        {stats.chartData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Task Time Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">每日任务用时情况</h3>
                <div className="flex gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary-500 rounded"></div>
                    <span className="text-gray-600">计划用时</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-600">实际用时</span>
                  </div>
                </div>
                <div className="h-48 flex items-end justify-between gap-2 border-b border-gray-200 pb-2">
                  {stats.chartData.map((d, i) => {
                    const maxVal = Math.max(getMaxValue(stats.chartData, 'plannedTime'), getMaxValue(stats.chartData, 'actualTime'))
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex gap-0.5">
                          <div 
                            className="flex-1 bg-primary-500 rounded-t transition-all" 
                            style={{ height: `${(d.plannedTime / maxVal) * 150}px` || '4px' }}
                          ></div>
                          <div 
                            className="flex-1 bg-green-500 rounded-t transition-all" 
                            style={{ height: `${(d.actualTime / maxVal) * 150}px` || '4px' }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{d.day}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Daily Task Completion Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">每日任务完成情况</h3>
                <div className="flex gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary-500 rounded"></div>
                    <span className="text-gray-600">完成任务数</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span className="text-gray-600">计划任务数</span>
                  </div>
                </div>
                <div className="h-48 flex items-end justify-between gap-2 border-b border-gray-200 pb-2">
                  {stats.chartData.map((d, i) => {
                    const maxVal = Math.max(getMaxValue(stats.chartData, 'totalTasks'), 1)
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex gap-0.5">
                          <div 
                            className="flex-1 bg-primary-500 rounded-t transition-all" 
                            style={{ height: `${(d.completedTasks / maxVal) * 150}px` || '4px' }}
                          ></div>
                          <div 
                            className="flex-1 bg-gray-300 rounded-t transition-all" 
                            style={{ height: `${(d.totalTasks / maxVal) * 150}px` || '4px' }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{d.day}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Time Distribution by Category */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">每日时间分布</h3>
                <div className="flex flex-wrap gap-3 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">学习</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-600">运动</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="text-gray-600">娱乐</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span className="text-gray-600">其他</span>
                  </div>
                </div>
                <div className="h-48 flex items-end justify-between gap-2 border-b border-gray-200 pb-2">
                  {stats.chartData.map((d, i) => {
                    const total = d.studyTime + d.exerciseTime + d.entertainmentTime + d.otherTime || 1
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div 
                          className="w-full rounded-t overflow-hidden"
                          style={{ height: '150px' }}
                        >
                          <div className="bg-blue-500" style={{ height: `${(d.studyTime / total) * 100}%` }}></div>
                          <div className="bg-green-500" style={{ height: `${(d.exerciseTime / total) * 100}%` }}></div>
                          <div className="bg-purple-500" style={{ height: `${(d.entertainmentTime / total) * 100}%` }}></div>
                          <div className="bg-gray-400" style={{ height: `${(d.otherTime / total) * 100}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500">{d.day}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Category Time Distribution */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">分类时间占比</h3>
                {stats.categoryStats.length > 0 ? (
                  <div className="space-y-3">
                    {stats.categoryStats.slice(0, 5).map((cat, i) => {
                      const totalTime = stats.categoryStats.reduce((sum, c) => sum + c.time, 0) || 1
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded ${getCategoryColor(cat.category)}`}></div>
                          <span className="flex-1 text-gray-700">{cat.category}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${getCategoryColor(cat.category)}`}
                              style={{ width: `${(cat.time / totalTime) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">{formatTime(cat.time)}</span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center">
                    <p className="text-gray-400">暂无数据</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Count by Category */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">各分类任务数统计</h3>
                {stats.categoryStats.length > 0 ? (
                  <div className="space-y-3">
                    {stats.categoryStats.slice(0, 6).map((cat, i) => {
                      const maxCount = Math.max(...stats.categoryStats.map(c => c.count), 1)
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <span className="w-16 text-sm text-gray-600">{cat.category}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${getCategoryColor(cat.category)}`}
                              style={{ width: `${(cat.count / maxCount) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 w-8">{cat.count}</span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center">
                    <p className="text-gray-400">暂无数据</p>
                  </div>
                )}
              </div>

              {/* Completion Time Distribution */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">完成时间段分布</h3>
                {stats.completionTimeDistribution.length > 0 ? (
                  <div className="h-48 flex items-end justify-between gap-1">
                    {stats.completionTimeDistribution.map((d, i) => {
                      const maxCount = Math.max(...stats.completionTimeDistribution.map(c => c.count), 1)
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-primary-400 rounded-t"
                            style={{ height: `${(d.count / maxCount) * 140}px` || '2px' }}
                          ></div>
                          <span className="text-xs text-gray-400 mt-1">{d.hour}:00</span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center">
                    <p className="text-gray-400">暂无数据</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无统计数据</h3>
            <p className="text-gray-500 mb-4">完成一些打卡后，这里会显示详细的分析图表</p>
            <Link href="/dashboard" className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              去打卡
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}