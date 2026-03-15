'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'

export default function AchievementsPage() {
  const [points] = useState(1250)

  const achievements = [
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header streak={15} totalPlans={unlockedCount} userName="用户" />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* 积分卡 */}
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-yellow-100 text-sm mb-1">当前积分</div>
              <div className="text-4xl font-bold">{points.toLocaleString()}</div>
            </div>
            <div className="text-5xl">🏆</div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-sm text-yellow-100">已解锁</div>
              <div className="text-xl font-bold">{unlockedCount}/{achievements.length}</div>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-sm text-yellow-100">等级</div>
              <div className="text-xl font-bold">Lv.5</div>
            </div>
          </div>
        </Card>

        {/* 成就列表 */}
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

        {/* 积分历史 */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">积分记录</h3>
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