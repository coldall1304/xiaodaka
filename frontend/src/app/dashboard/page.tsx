'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { useAuth } from '@/hooks/useAuth'
import { usePlans } from '@/hooks/usePlans'
import { useStats } from '@/hooks/useStats'
import AddPlanModal from '@/components/AddPlanModal'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { plans, loading: plansLoading, addPlan, checkIn } = usePlans(user?.id)
  const { stats, loading: statsLoading } = useStats(user?.id)
  const [showAddModal, setShowAddModal] = useState(false)

  const loading = authLoading || plansLoading || statsLoading

  const handleAddPlan = async (planData: any) => {
    await addPlan(planData)
    setShowAddModal(false)
  }

  const handleCheckIn = async (planId: string) => {
    await checkIn(planId)
  }

  // 计算今日任务完成率
  const completedToday = plans.filter(p => p.todayCompleted).length
  const totalPlans = plans.length

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
        streak={stats?.currentStreak || 0}
        totalPlans={stats?.activePlans || 0}
        userName={user?.name || '用户'}
      />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <div className="text-3xl mb-1">📚</div>
            <div className="text-2xl font-bold text-gray-800">{stats?.totalCheckIns || 0}</div>
            <div className="text-sm text-gray-500">总打卡</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-3xl mb-1">🔥</div>
            <div className="text-2xl font-bold text-orange-500">{stats?.currentStreak || 0}</div>
            <div className="text-sm text-gray-500">连续天数</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-3xl mb-1">✅</div>
            <div className="text-2xl font-bold text-green-500">{completedToday}/{totalPlans}</div>
            <div className="text-sm text-gray-500">今日任务</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-3xl mb-1">🏆</div>
            <div className="text-2xl font-bold text-primary-600">{stats?.totalPoints || 0}</div>
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
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              + 添加计划
            </button>
          </div>

          {plans.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 mb-4">还没有学习计划</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                创建第一个计划
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {plans.map(plan => (
                <div key={plan.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-3 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: plan.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{plan.title}</div>
                      {plan.description && (
                        <div className="text-sm text-gray-500 truncate mt-0.5">
                          {plan.description}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>🔥 连续 {plan.streak} 天</span>
                        {plan.startTime && plan.endTime && (
                          <span>⏰ {plan.startTime} - {plan.endTime}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCheckIn(plan.id)}
                    disabled={plan.todayCompleted}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0 ml-3 ${
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
          )}
        </Card>
      </main>

      <AddPlanModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddPlan}
      />
    </div>
  )
}