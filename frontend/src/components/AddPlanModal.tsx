'use client'

import { useState } from 'react'

interface AddPlanModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (plan: any) => void
}

export default function AddPlanModal({ isOpen, onClose, onAdd }: AddPlanModalProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('study')
  const [frequency, setFrequency] = useState('daily')
  const [reminderTime, setReminderTime] = useState('09:00')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const plan = {
        title,
        category,
        frequency,
        reminderTime,
        startDate: new Date().toISOString(),
      }
      onAdd(plan)
      onClose()
      setTitle('')
    } catch (error) {
      console.error('Failed to add plan:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">添加学习计划</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 计划名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              计划名称
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：每日英语学习"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* 分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分类
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'study', label: '📚 学习' },
                { value: 'exercise', label: '🏃 运动' },
                { value: 'habit', label: '💪 习惯' },
                { value: 'other', label: '📌 其他' },
              ].map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                    category === cat.value
                      ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 频率 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              重复频率
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="daily">每天</option>
              <option value="weekdays">工作日</option>
              <option value="weekends">周末</option>
              <option value="weekly">每周</option>
              <option value="custom">自定义</option>
            </select>
          </div>

          {/* 提醒时间 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              提醒时间
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>

          {/* 按钮 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '添加中...' : '添加计划'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}