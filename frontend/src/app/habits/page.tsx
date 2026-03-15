'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import CreateHabitModal from '@/components/CreateHabitModal'

interface Habit {
  id: string
  title: string
  description?: string
  color: string
  streak: number
  todayCompleted: boolean
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [stats] = useState({
    todayEarned: 0,
    todayDeducted: 0,
    todayCheckIns: 0,
    starBalance: 0,
  })

  useEffect(() => {
    // TODO: 从 API 获取数据
    setHabits([
      { id: '1', title: '早起', description: '每天早上6点起床', color: '#F97316', streak: 7, todayCompleted: false },
    ])
    setLoading(false)
  }, [])

  const handleCheckIn = async (habitId: string) => {
    setHabits(habits.map(h => 
      h.id === habitId ? { ...h, todayCompleted: true, streak: h.streak + 1 } : h
    ))
  }

  const fetchHabits = async () => {
    // TODO: 从 API 获取数据
    setHabits([
      { id: '1', title: '早起', description: '每天早上6点起床', color: '#F97316', streak: 7, todayCompleted: false },
    ])
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
      <Header streak={7} totalPlans={habits.length} userName="用户" />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* 统计概览 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <div className="text-green-500 text-lg">+{stats.todayEarned}</div>
            <div className="text-xs text-gray-500">当日获得</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-red-500 text-lg">-{stats.todayDeducted}</div>
            <div className="text-xs text-gray-500">当日扣除</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-gray-900 text-lg">{stats.todayCheckIns}</div>
            <div className="text-xs text-gray-500">当日打卡</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-yellow-500 text-lg">⭐ {stats.starBalance}</div>
            <div className="text-xs text-gray-500">星星余额</div>
          </Card>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            <span>➕</span>
            新建习惯
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition">
            <span>📥</span>
            导入其他用户习惯
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition">
            <span>📋</span>
            添加默认习惯
          </button>
        </div>

        {/* 习惯列表 */}
        {habits.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">还没有行为习惯</h3>
            <p className="text-gray-500 mb-6">创建你的第一个行为习惯，开始培养好习惯，赚取星星积分吧！</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
            >
              <span>➕</span>
              创建第一个习惯
            </button>
          </Card>
        ) : (
          <div className="space-y-3">
            {habits.map(habit => (
              <Card key={habit.id} className="flex items-center gap-4">
                {/* 图标 */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: habit.color }}
                >
                  {habit.todayCompleted ? '✓' : '🌟'}
                </div>

                {/* 信息 */}
                <div className="flex-1">
                  <div className={`font-medium ${habit.todayCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {habit.title}
                  </div>
                  {habit.description && (
                    <div className="text-sm text-gray-500">{habit.description}</div>
                  )}
                </div>

                {/* 连续天数 */}
                <div className="text-center px-4">
                  <div className="text-lg font-bold text-orange-500">{habit.streak}</div>
                  <div className="text-xs text-gray-500">连续</div>
                </div>

                {/* 打卡按钮 */}
                <button
                  onClick={() => handleCheckIn(habit.id)}
                  disabled={habit.todayCompleted}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    habit.todayCompleted
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {habit.todayCompleted ? '✓ 已完成' : '打卡'}
                </button>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* 创建习惯弹窗 */}
      <CreateHabitModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={fetchHabits}
      />
    </div>
  )
}