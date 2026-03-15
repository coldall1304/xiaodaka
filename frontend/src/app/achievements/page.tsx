'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'

interface Achievement {
  id: string
  icon: string
  title: string
  desc: string
  unlocked: boolean
  progress?: number
  total?: number
  points: number
}

interface Wish {
  id: string
  title: string
  description?: string
  points: number
  icon: string
  isCompleted: boolean
  createdAt: string
}

export default function AchievementsPage() {
  const [points, setPoints] = useState(0)
  const [wishes, setWishes] = useState<Wish[]>([])
  const [showAddWish, setShowAddWish] = useState(false)
  const [newWish, setNewWish] = useState({ title: '', points: 100, icon: '🎁' })
  const [loading, setLoading] = useState(false)

  const achievements: Achievement[] = [
    { id: '1', icon: '🌟', title: '新手启程', desc: '完成第一次打卡', unlocked: true, points: 10 },
    { id: '2', icon: '🔥', title: '连续7天', desc: '连续打卡7天', unlocked: true, points: 50 },
    { id: '3', icon: '💪', title: '坚持者', desc: '连续打卡30天', unlocked: false, progress: 15, total: 30, points: 200 },
    { id: '4', icon: '📚', title: '学霸', desc: '累计学习100小时', unlocked: false, progress: 54, total: 100, points: 300 },
    { id: '5', icon: '🏃', title: '运动达人', desc: '累计运动50小时', unlocked: false, progress: 12, total: 50, points: 200 },
    { id: '6', icon: '🌅', title: '早起鸟', desc: '连续30天早起打卡', unlocked: false, progress: 7, total: 30, points: 150 },
    { id: '7', icon: '📖', title: '阅读者', desc: '累计阅读50天', unlocked: true, points: 100 },
    { id: '8', icon: '🏆', title: '百日王者', desc: '连续打卡100天', unlocked: false, progress: 15, total: 100, points: 500 },
  ]

  const unlockedCount = achievements.filter(a => a.unlocked).length

  const iconOptions = ['🎁', '🍕', '🎮', '🎬', '📚', '☕', '🍰', '🎵', '🛍️', '✈️']

  // 加载数据
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // 获取积分
      const pointsRes = await fetch('/api/users/points')
      if (pointsRes.ok) {
        const data = await pointsRes.json()
        setPoints(data.totalPoints || 0)
      }

      // 获取愿望列表
      const wishesRes = await fetch('/api/wishes')
      if (wishesRes.ok) {
        const data = await wishesRes.json()
        setWishes(data.wishes || [])
      }
    } catch (error) {
      console.error('加载数据失败:', error)
    }
  }

  // 添加愿望
  const handleAddWish = async () => {
    if (!newWish.title.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWish)
      })

      if (res.ok) {
        const data = await res.json()
        setWishes(prev => [data.wish, ...prev])
        setNewWish({ title: '', points: 100, icon: '🎁' })
        setShowAddWish(false)
      }
    } catch (error) {
      console.error('添加愿望失败:', error)
    }
    setLoading(false)
  }

  // 兑换愿望
  const handleRedeem = async (wishId: string) => {
    if (!confirm('确定要用积分兑换这个愿望吗？')) return

    setLoading(true)
    try {
      const res = await fetch('/api/wishes/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishId })
      })

      if (res.ok) {
        fetchData() // 刷新数据
        alert('兑换成功！🎉')
      } else {
        const data = await res.json()
        alert(data.error || '兑换失败')
      }
    } catch (error) {
      console.error('兑换失败:', error)
      alert('兑换失败')
    }
    setLoading(false)
  }

  // 删除愿望
  const handleDeleteWish = async (wishId: string) => {
    if (!confirm('确定要删除这个愿望吗？')) return

    try {
      const res = await fetch(`/api/wishes?id=${wishId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setWishes(prev => prev.filter(w => w.id !== wishId))
      }
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  const pendingWishes = wishes.filter(w => !w.isCompleted)
  const completedWishes = wishes.filter(w => w.isCompleted)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header streak={15} totalPlans={unlockedCount} userName="用户" />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* 积分卡 */}
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-yellow-100 text-sm mb-1">我的星星</div>
              <div className="text-4xl font-bold">{points.toLocaleString()}</div>
            </div>
            <div className="text-5xl">⭐</div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-sm text-yellow-100">已解锁成就</div>
              <div className="text-xl font-bold">{unlockedCount}/{achievements.length}</div>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-sm text-yellow-100">愿望清单</div>
              <div className="text-xl font-bold">{pendingWishes.length}</div>
            </div>
          </div>
        </Card>

        {/* 愿望清单 */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">🌟 愿望清单</h3>
            <button
              onClick={() => setShowAddWish(true)}
              className="px-3 py-1.5 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600"
            >
              + 添加愿望
            </button>
          </div>

          {/* 添加愿望表单 */}
          {showAddWish && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="我想要..."
                  value={newWish.title}
                  onChange={e => setNewWish(prev => ({ ...prev, title: e.target.value }))}
                  className="col-span-2 px-3 py-2 border rounded-lg"
                />
                <div>
                  <label className="text-sm text-gray-500">所需积分</label>
                  <input
                    type="number"
                    value={newWish.points}
                    onChange={e => setNewWish(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">图标</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {iconOptions.map(icon => (
                      <button
                        key={icon}
                        onClick={() => setNewWish(prev => ({ ...prev, icon }))}
                        className={`text-xl p-1 rounded ${newWish.icon === icon ? 'bg-primary-100 ring-2 ring-primary-500' : 'hover:bg-gray-100'}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleAddWish}
                  disabled={loading || !newWish.title.trim()}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                >
                  添加
                </button>
                <button
                  onClick={() => setShowAddWish(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          {/* 愿望列表 */}
          {pendingWishes.length === 0 && completedWishes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🎁</div>
              <p>还没有愿望，添加一个吧！</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingWishes.map(wish => (
                <div key={wish.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-2xl">{wish.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{wish.title}</div>
                    <div className="text-sm text-orange-500">需要 {wish.points} 星星</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRedeem(wish.id)}
                      disabled={loading || points < wish.points}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        points >= wish.points
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {points >= wish.points ? '兑换' : '积分不足'}
                    </button>
                    <button
                      onClick={() => handleDeleteWish(wish.id)}
                      className="px-2 py-1.5 text-gray-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              {/* 已完成的愿望 */}
              {completedWishes.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-500 mb-2">已兑换</div>
                  {completedWishes.map(wish => (
                    <div key={wish.id} className="flex items-center gap-3 p-2 text-gray-400">
                      <div className="text-xl">{wish.icon}</div>
                      <div className="flex-1 line-through">{wish.title}</div>
                      <Badge variant="success">已兑换</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* 成就列表 */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">🏆 成就勋章</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map(achievement => (
              <Card
                key={achievement.id}
                className={`flex items-center gap-4 ${!achievement.unlocked ? 'opacity-60' : ''}`}
              >
                {/* 图标 */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-yellow-100 to-orange-100'
                      : 'bg-gray-100'
                  }`}
                >
                  {achievement.icon}
                </div>

                {/* 信息 */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                  <p className="text-sm text-gray-500">{achievement.desc}</p>
                  
                  {/* 进度条 */}
                  {achievement.progress !== undefined && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-400 rounded-full"
                          style={{ width: `${(achievement.progress / achievement.total!) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {achievement.progress}/{achievement.total}
                      </div>
                    </div>
                  )}
                </div>

                {/* 积分 */}
                <div className="text-right">
                  <div className="text-sm text-orange-500 font-medium">+{achievement.points}</div>
                  {achievement.unlocked && (
                    <Badge variant="success">已解锁</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 积分历史 */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">📝 积分记录</h3>
          <div className="space-y-3">
            {[
              { time: '今天 08:00', action: '早起打卡', points: 10 },
              { time: '今天 07:30', action: '连续7天奖励', points: 50 },
              { time: '昨天 22:00', action: '阅读打卡', points: 10 },
              { time: '昨天 18:00', action: '运动打卡', points: 10 },
            ].map((record, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <div className="text-gray-900">{record.action}</div>
                  <div className="text-xs text-gray-400">{record.time}</div>
                </div>
                <div className="text-orange-500 font-medium">+{record.points}</div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  )
}