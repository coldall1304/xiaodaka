'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Tabs } from '@/components/Tabs'

export default function StatsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week')

  const stats = {
    totalCheckIns: 156,
    totalStudyTime: 3240,
    totalHabits: 23,
    avgCompletionRate: 87,
    longestStreak: 21,
    currentStreak: 15,
  }

  const weeklyData = [
    { day: '周一', study: 45, exercise: 30 },
    { day: '周二', study: 60, exercise: 0 },
    { day: '周三', study: 30, exercise: 45 },
    { day: '周四', study: 90, exercise: 30 },
    { day: '周五', study: 45, exercise: 0 },
    { day: '周六', study: 120, exercise: 60 },
    { day: '周日', study: 60, exercise: 30 },
  ]

  const maxStudy = Math.max(...weeklyData.map(d => d.study))

  return (
    <div className="min-h-screen bg-gray-50">
      <Header streak={stats.currentStreak} totalPlans={stats.totalCheckIns} userName="用户" />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* 时间选择 */}
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                period === p
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p === 'week' ? '本周' : p === 'month' ? '本月' : '本年'}
            </button>
          ))}
        </div>

        {/* 概览卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '✅', label: '总打卡', value: stats.totalCheckIns },
            { icon: '📚', label: '学习时长', value: `${Math.floor(stats.totalStudyTime / 60)}h` },
            { icon: '💪', label: '习惯完成', value: stats.totalHabits },
            { icon: '📊', label: '完成率', value: `${stats.avgCompletionRate}%` },
          ].map(stat => (
            <Card key={stat.label} className="text-center p-4">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* 连续打卡 */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">打卡记录</h3>
          <div className="flex justify-around">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{stats.currentStreak}</div>
              <div className="text-sm text-gray-500">当前连续</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">{stats.longestStreak}</div>
              <div className="text-sm text-gray-500">最长连续</div>
            </div>
          </div>
        </Card>

        {/* 学习时间图表 */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">每日学习时间</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {weeklyData.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all duration-300"
                  style={{ height: `${(d.study / maxStudy) * 150}px` }}
                />
                <div className="text-xs text-gray-500 mt-2">{d.day}</div>
                <div className="text-xs text-primary-600 font-medium">{d.study}m</div>
              </div>
            ))}
          </div>
        </Card>

        {/* 分类统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="font-semibold text-gray-800 mb-4">时间分配</h3>
            <div className="space-y-3">
              {[
                { name: '学习时间', percent: 65, color: 'bg-blue-500' },
                { name: '运动时间', percent: 35, color: 'bg-green-500' },
              ].map(item => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium">{item.percent}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-800 mb-4">习惯完成率</h3>
            <div className="space-y-3">
              {[
                { name: '早起', rate: 95 },
                { name: '阅读', rate: 80 },
                { name: '运动', rate: 60 },
                { name: '冥想', rate: 75 },
              ].map(h => (
                <div key={h.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{h.name}</span>
                    <span className="font-medium">{h.rate}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${h.rate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}