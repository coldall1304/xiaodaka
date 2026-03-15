'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

interface Stats {
  totalTasks: number
  completedTasks: number
  avgCompletionRate: number
  totalHours: number
  avgDailyHours: number
  mostActiveDay: string
}

export default function StatsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    avgCompletionRate: 0,
    totalHours: 0,
    avgDailyHours: 0,
    mostActiveDay: '无'
  })
  const [timeRange, setTimeRange] = useState('7days')

  useEffect(() => {
    if (user?.id) {
      // TODO: 从API获取真实统计数据
    }
  }, [user?.id, timeRange])

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
            <button
              onClick={() => setTimeRange('custom')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                timeRange === 'custom'
                  ? 'bg-white text-primary-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              自定义
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
              <p className="text-white/80 text-sm mt-1">近七日 · 待生成</p>
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
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalHours}h</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-gray-500 text-sm">日均时长</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.avgDailyHours}h</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-gray-500 text-sm">最活跃</div>
            <div className="text-3xl font-bold text-orange-500 mt-2">{stats.mostActiveDay}</div>
          </div>
        </div>

        {/* Charts */}
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
              {[0, 0, 0, 0, 0, 0, 0].map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-gray-200 rounded-t" style={{ height: '10px' }}></div>
                  <span className="text-xs text-gray-500">{['一', '二', '三', '四', '五', '六', '日'][i]}</span>
                </div>
              ))}
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
              {[0, 0, 0, 0, 0, 0, 0].map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-gray-200 rounded-t" style={{ height: '10px' }}></div>
                  <span className="text-xs text-gray-500">{['一', '二', '三', '四', '五', '六', '日'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time Distribution by Category */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">每日时间分布</h3>
            <div className="flex gap-4 text-sm mb-4">
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
              {[0, 0, 0, 0, 0, 0, 0].map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-gray-200 rounded-t" style={{ height: '10px' }}></div>
                  <span className="text-xs text-gray-500">{['一', '二', '三', '四', '五', '六', '日'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Time Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">分类时间占比</h3>
            <div className="h-48 flex items-center justify-center">
              <p className="text-gray-400">暂无数据</p>
            </div>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Daily Time Comparison */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">各分类每日用时对比</h3>
            <div className="h-48 flex items-end justify-between gap-2 border-b border-gray-200 pb-2">
              {[0, 0, 0, 0, 0, 0, 0].map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-gray-200 rounded-t" style={{ height: '10px' }}></div>
                  <span className="text-xs text-gray-500">{['一', '二', '三', '四', '五', '六', '日'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Task Count by Category */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">各分类任务数统计</h3>
            <div className="h-48 flex items-center justify-center">
              <p className="text-gray-400">暂无数据</p>
            </div>
          </div>

          {/* Completion Time Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">完成时间段分布</h3>
            <div className="h-48 flex items-center justify-center">
              <p className="text-gray-400">暂无数据</p>
            </div>
          </div>

          {/* Task Count Percentage by Category */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">各分类任务数占比</h3>
            <div className="h-48 flex items-center justify-center">
              <p className="text-gray-400">暂无数据</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}