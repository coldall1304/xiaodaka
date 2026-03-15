'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { useAuth } from '@/hooks/useAuth'
import { usePlans } from '@/hooks/usePlans'
import { useStats } from '@/hooks/useStats'
import AddPlanModal from '@/components/AddPlanModal'
import AIPlanModal from '@/components/AIPlanModal'
import BatchPlanModal from '@/components/BatchPlanModal'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { plans, loading: plansLoading, addPlan, checkIn } = usePlans(user?.id)
  const { stats, loading: statsLoading } = useStats(user?.id)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showBatchModal, setShowBatchModal] = useState(false)

  const loading = authLoading || plansLoading || statsLoading

  const handleAddPlan = async (planData: any) => {
    await addPlan(planData)
    setShowAddModal(false)
  }

  const handleAIGenerated = async (planData: any) => {
    if (planData.edit) {
      setShowAddModal(true)
    } else {
      await addPlan(planData)
    }
  }

  const handleCheckIn = async (planId: string) => {
    await checkIn(planId)
  }

  // 计算今日任务完成率
  const completedToday = plans.filter(p => p.todayCompleted).length
  const totalPlans = plans.length

  // 格式化时间（分钟 -> X小时X分钟）
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h${mins}m` : `${hours}h`
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
        streak={stats?.currentStreak || 0}
        totalPlans={stats?.activePlans || 0}
        userName={user?.name || '用户'}
      />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards - 对标原网站 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <div className="text-sm text-gray-500 mb-1">今日学习时间</div>
            <div className="text-2xl font-bold text-primary-600">{formatTime(stats?.todayStudyTime || 0)}</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-sm text-gray-500 mb-1">运动户外时间</div>
            <div className="text-2xl font-bold text-green-600">{formatTime(stats?.todayExerciseTime || 0)}</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-sm text-gray-500 mb-1">今日任务数量</div>
            <div className="text-2xl font-bold text-gray-800">{completedToday}/{totalPlans}</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-sm text-gray-500 mb-1">今日完成率</div>
            <div className="text-2xl font-bold text-orange-500">{stats?.todayCompletionRate || 0}%</div>
          </Card>
        </div>

        {/* Second Row Stats */}
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
            <div className="text-3xl mb-1">📅</div>
            <div className="text-2xl font-bold text-gray-800">{stats?.activePlans || 0}</div>
            <div className="text-sm text-gray-500">活跃计划</div>
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
            <div className="flex gap-2">
              <button
                onClick={() => setShowAIModal(true)}
                className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition flex items-center gap-1 text-sm"
              >
                <span>🤖</span>
                AI创建
              </button>
              <button
                onClick={() => setShowBatchModal(true)}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-1 text-sm"
              >
                <span>📋</span>
                批量添加
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm"
              >
                + 添加
              </button>
            </div>
          </div>

          {plans.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 mb-4">还没有学习计划</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowAIModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 flex items-center gap-2 text-sm"
                >
                  <span>🤖</span>
                  AI 创建
                </button>
                <button
                  onClick={() => setShowBatchModal(true)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 text-sm"
                >
                  <span>📋</span>
                  批量添加
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                >
                  手动创建
                </button>
              </div>
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

      <AIPlanModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerated={handleAIGenerated}
      />

      <BatchPlanModal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        onCreated={() => {
          // 刷新计划列表
          window.location.reload()
        }}
      />
    </div>
  )
}