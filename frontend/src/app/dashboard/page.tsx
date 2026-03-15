'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

interface Plan {
  id: string
  title: string
  category: string
  color: string
  isActive: boolean
  streak: number
  todayCompleted: boolean
}

export default function DashboardPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [stats] = useState({
    streak: 7,
    totalPlans: 15,
    userName: '用户',
  })

  useEffect(() => {
    setPlans([
      { id: '1', title: '每天背单词 30 个', category: 'study', color: '#3B82F6', isActive: true, streak: 15, todayCompleted: true },
      { id: '2', title: '晨跑 5 公里', category: 'exercise', color: '#10B981', isActive: true, streak: 8, todayCompleted: false },
      { id: '3', title: '阅读 30 分钟', category: 'study', color: '#8B5CF6', isActive: true, streak: 22, todayCompleted: false },
    ])
    setLoading(false)
  }, [])

  const handleCheckIn = async (planId: string) => {
    setPlans(plans.map(p => 
      p.id === planId ? { ...p, todayCompleted: true, streak: p.streak + 1 } : p
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        streak={stats.streak}
        totalPlans={stats.totalPlans}
        userName={stats.userName}
      />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <div className="text-3xl mb-1">📚</div>
            <div className="text-2xl font-bold text-gray-800">45</div>
            <div className="text-sm text-gray-500">总打卡</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-3xl mb-1">🔥</div>
            <div className="text-2xl font-bold text-orange-500">{stats.streak}</div>
            <div className="text-sm text-gray-500">连续天数</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-3xl mb-1">✅</div>
            <div className="text-2xl font-bold text-green-500">3/5</div>
            <div className="text-sm text-gray-500">今日任务</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-3xl mb-1">🏆</div>
            <div className="text-2xl font-bold text-primary-600">320</div>
            <div className="text-sm text-gray-500">积分</div>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: '📈', title: '统计', href: '/stats' },
            { icon: '🏆', title: '成就', href: '/achievements' },
            { icon: '💪', title: '习惯', href: '/habits' },
            { icon: '❓', title: '帮助', href: '/help' },
          ].map(item => (
            <Link key={item.href} href={item.href}>
              <Card className="p-3 text-center hover:shadow-md transition cursor-pointer">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-sm font-medium text-gray-700">{item.title}</div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Plans List */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">我的计划</h2>
          </div>

          <div className="space-y-3">
            {plans.map(plan => (
              <div key={plan.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-10 rounded-full" style={{ backgroundColor: plan.color }} />
                  <div>
                    <div className="font-medium text-gray-900">{plan.title}</div>
                    <div className="text-sm text-gray-500">连续 {plan.streak} 天</div>
                  </div>
                </div>
                <button
                  onClick={() => handleCheckIn(plan.id)}
                  disabled={plan.todayCompleted}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    plan.todayCompleted
                      ? 'bg-green-100 text-green-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {plan.todayCompleted ? '✓ 已打卡' : '打卡'}
                </button>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  )
}
