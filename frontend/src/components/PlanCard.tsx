'use client'

import { useState } from 'react'

interface PlanCardProps {
  id: string
  title: string
  category: string
  color: string
  streak: number
  todayCompleted: boolean
  onCheckIn: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function PlanCard({
  id,
  title,
  category,
  color,
  streak,
  todayCompleted,
  onCheckIn,
  onEdit,
  onDelete,
}: PlanCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const categoryIcons: Record<string, string> = {
    study: '📚',
    exercise: '🏃',
    habit: '✨',
    other: '📌',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {/* 颜色标记 */}
          <div
            className="w-1 h-12 rounded-full mt-1"
            style={{ backgroundColor: color }}
          />
          
          <div>
            {/* 标题和分类 */}
            <div className="flex items-center gap-2">
              <span className="text-lg">{categoryIcons[category] || '📌'}</span>
              <h3 className="font-medium text-gray-900">{title}</h3>
            </div>
            
            {/* 连续天数 */}
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
              <span className="text-orange-500">🔥</span>
              <span>连续 {streak} 天</span>
            </div>
          </div>
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-2">
          {/* 打卡按钮 */}
          <button
            onClick={() => onCheckIn(id)}
            disabled={todayCompleted}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition
              ${todayCompleted
                ? 'bg-green-100 text-green-600 cursor-default'
                : 'bg-green-500 text-white hover:bg-green-600'
              }
            `}
          >
            {todayCompleted ? '✓ 已打卡' : '打卡'}
          </button>

          {/* 更多菜单 */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              ⋯
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border z-10">
                <button
                  onClick={() => {
                    onEdit(id)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  ✏️ 编辑
                </button>
                <button
                  onClick={() => {
                    onDelete(id)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  🗑️ 删除
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 周视图 */}
      <div className="mt-4 flex gap-1">
        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - day))
          const isToday = day === 6
          const isCompleted = Math.random() > 0.3 // 模拟数据
          
          return (
            <div
              key={day}
              className={`flex-1 aspect-square rounded-md flex items-center justify-center text-xs ${
                isCompleted
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              } ${isToday ? 'ring-2 ring-primary-500' : ''}`}
            >
              {date.getDate()}
            </div>
          )
        })}
      </div>
    </div>
  )
}