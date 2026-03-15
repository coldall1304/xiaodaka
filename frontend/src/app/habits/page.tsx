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
  type: 'positive' | 'negative' // 加分 or 扣分
  frequency: 'daily' | 'weekly'
  points: number
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [stats] = useState({
    todayEarned: 0,
    todayDeducted: 0,
    todayCheckIns: 0,
    starBalance: 0,
  })

  // 加载习惯数据
  useEffect(() => {
    // TODO: 从 API 获取数据
    const mockHabits: Habit[] = [
      { id: '1', title: '早起', description: '每天早上6点起床', color: '#F97316', streak: 7, todayCompleted: false, type: 'positive', frequency: 'daily', points: 1 },
      { id: '2', title: '阅读30分钟', description: '每天阅读半小时', color: '#3B82F6', streak: 12, todayCompleted: true, type: 'positive', frequency: 'daily', points: 2 },
      { id: '3', title: '运动1小时', description: '每周运动3次', color: '#10B981', streak: 5, todayCompleted: false, type: 'positive', frequency: 'weekly', points: 3 },
      { id: '4', title: '熬夜', description: '超过12点睡觉扣分', color: '#EF4444', streak: 0, todayCompleted: false, type: 'negative', frequency: 'daily', points: -1 },
    ]
    setHabits(mockHabits)
    setLoading(false)
  }, [])

  // 筛选和搜索
  useEffect(() => {
    let filtered = [...habits]

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(h => 
        h.title.toLowerCase().includes(query) ||
        h.description?.toLowerCase().includes(query)
      )
    }

    // 筛选过滤
    switch (activeFilter) {
      case 'positive':
        filtered = filtered.filter(h => h.type === 'positive')
        break
      case 'negative':
        filtered = filtered.filter(h => h.type === 'negative')
        break
      case 'completed':
        filtered = filtered.filter(h => h.todayCompleted)
        break
      case 'pending':
        filtered = filtered.filter(h => !h.todayCompleted)
        break
      case 'daily':
        filtered = filtered.filter(h => h.frequency === 'daily')
        break
      case 'weekly':
        filtered = filtered.filter(h => h.frequency === 'weekly')
        break
    }

    setFilteredHabits(filtered)
  }, [habits, searchQuery, activeFilter])

  const handleCheckIn = async (habitId: string) => {
    setHabits(habits.map(h => 
      h.id === habitId ? { ...h, todayCompleted: true, streak: h.streak + 1 } : h
    ))
  }

  const fetchHabits = async () => {
    // TODO: 从 API 获取数据
  }

  // 筛选按钮配置
  const filterButtons = [
    { key: 'all', label: '全部' },
    { key: 'positive', label: '加分' },
    { key: 'negative', label: '扣分' },
    { key: 'completed', label: '已完成' },
    { key: 'pending', label: '待完成' },
    { key: 'daily', label: '每日多次' },
    { key: 'weekly', label: '每周多次' },
  ]

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

        {/* 操作栏 */}
        <Card className="p-4">
          <div className="flex flex-col gap-4">
            {/* 搜索和视图切换 */}
            <div className="flex items-center gap-3">
              {/* 搜索框 */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索习惯名称或描述..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>

              {/* 视图切换 */}
              <div className="flex gap-1 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded text-sm ${viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  网格
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded text-sm ${viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  列表
                </button>
              </div>
            </div>

            {/* 筛选按钮 */}
            <div className="flex gap-2 flex-wrap">
              {filterButtons.map(btn => (
                <button
                  key={btn.key}
                  onClick={() => setActiveFilter(btn.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeFilter === btn.key
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

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
        {filteredHabits.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || activeFilter !== 'all' ? '没有找到匹配的习惯' : '还没有行为习惯'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || activeFilter !== 'all' 
                ? '尝试调整搜索条件或筛选' 
                : '创建你的第一个行为习惯，开始培养好习惯，赚取星星积分吧！'}
            </p>
            {!searchQuery && activeFilter === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
              >
                <span>➕</span>
                创建第一个习惯
              </button>
            )}
          </Card>
        ) : viewMode === 'grid' ? (
          /* 网格视图 */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHabits.map(habit => (
              <Card key={habit.id} className="p-4">
                <div className="flex items-start gap-3">
                  {/* 图标 */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: habit.color }}
                  >
                    {habit.todayCompleted ? '✓' : '🌟'}
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${habit.todayCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {habit.title}
                    </div>
                    {habit.description && (
                      <div className="text-sm text-gray-500 truncate">{habit.description}</div>
                    )}
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span>{habit.frequency === 'daily' ? '每日一次' : '每周多次'}</span>
                      <span className={habit.points > 0 ? 'text-green-600' : 'text-red-600'}>
                        {habit.points > 0 ? '+' : ''}{habit.points}⭐
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    🔥 连续 <span className="font-bold text-orange-500">{habit.streak}</span> 天
                  </div>
                  <button
                    onClick={() => handleCheckIn(habit.id)}
                    disabled={habit.todayCompleted}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                      habit.todayCompleted
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {habit.todayCompleted ? '已完成' : '打卡'}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* 列表视图 */
          <div className="space-y-3">
            {filteredHabits.map(habit => (
              <Card key={habit.id} className="flex items-center gap-4">
                {/* 图标 */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: habit.color }}
                >
                  {habit.todayCompleted ? '✓' : '🌟'}
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className={`font-medium ${habit.todayCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {habit.title}
                  </div>
                  {habit.description && (
                    <div className="text-sm text-gray-500 truncate">{habit.description}</div>
                  )}
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span>{habit.frequency === 'daily' ? '每日一次' : '每周多次'}</span>
                    <span className={habit.points > 0 ? 'text-green-600' : 'text-red-600'}>
                      {habit.points > 0 ? '+' : ''}{habit.points}⭐
                    </span>
                  </div>
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
                  {habit.todayCompleted ? '已完成' : '打卡'}
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