'use client'

import { useState } from 'react'

interface CreateHabitModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated: () => void
}

const ICONS = [
  { id: 'star', emoji: '⭐', name: '星星' },
  { id: 'sun', emoji: '☀️', name: '太阳' },
  { id: 'moon', emoji: '🌙', name: '月亮' },
  { id: 'fire', emoji: '🔥', name: '火焰' },
  { id: 'dumbbell', emoji: '🏋️', name: '哑铃' },
  { id: 'book', emoji: '📖', name: '书本' },
  { id: 'pen', emoji: '✏️', name: '笔' },
  { id: 'clock', emoji: '⏰', name: '时钟' },
  { id: 'heart', emoji: '❤️', name: '爱心' },
  { id: 'leaf', emoji: '🌿', name: '叶子' },
  { id: 'music', emoji: '🎵', name: '音乐' },
  { id: 'camera', emoji: '📷', name: '相机' },
  { id: 'bulb', emoji: '💡', name: '灯泡' },
  { id: 'run', emoji: '🏃', name: '跑步' },
  { id: 'medal', emoji: '🏅', name: '奖章' },
  { id: 'trophy', emoji: '🏆', name: '奖杯' },
]

const COLORS = [
  { id: 'blue', value: '#3B82F6', name: '蓝色' },
  { id: 'indigo', value: '#6366F1', name: '靛蓝' },
  { id: 'cyan', value: '#06B6D4', name: '青色' },
  { id: 'teal', value: '#14B8A6', name: '蓝绿' },
  { id: 'green', value: '#10B981', name: '绿色' },
  { id: 'lime', value: '#84CC16', name: '青柠' },
  { id: 'yellow', value: '#EAB308', name: '黄色' },
  { id: 'orange', value: '#F97316', name: '橙色' },
  { id: 'red', value: '#EF4444', name: '红色' },
  { id: 'pink', value: '#EC4899', name: '粉色' },
  { id: 'purple', value: '#8B5CF6', name: '紫色' },
]

export default function CreateHabitModal({ isOpen, onClose, onCreated }: CreateHabitModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('daily')
  const [points, setPoints] = useState(1)
  const [icon, setIcon] = useState('star')
  const [color, setColor] = useState('#3B82F6')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user',
          title: name,
          description,
          color,
          reminderTime: '09:00',
        }),
      })

      if (res.ok) {
        setName('')
        setDescription('')
        onCreated()
        onClose()
      }
    } catch (error) {
      console.error('Failed to create habit:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">新建习惯</h2>
          <p className="text-gray-500 text-sm mt-1">创建和配置您的行为习惯</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 习惯名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              习惯名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：早起、运动"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              required
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述这个习惯的具体内容"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>

          {/* 习惯类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              习惯类型
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="daily">每日一次</option>
              <option value="weekly">每周多次</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              {type === 'daily' ? '每天只能打卡一次' : '每周可打卡多次'}
            </p>
          </div>

          {/* 积分设置 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              积分设置
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              placeholder="输入-100到100之间的数字"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              min={-100}
              max={100}
            />
            <p className="text-xs text-gray-400 mt-1">
              正数：奖励积分 | 负数：扣除积分（范围：-100 到 100）
            </p>
          </div>

          {/* 图标选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              图标
            </label>
            <div className="grid grid-cols-8 gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic.id}
                  type="button"
                  onClick={() => setIcon(ic.id)}
                  className={`p-2 text-xl rounded-lg transition ${
                    icon === ic.id
                      ? 'bg-primary-100 ring-2 ring-primary-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  title={ic.name}
                >
                  {ic.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* 颜色选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              颜色
            </label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full transition ${
                    color === c.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* 预览 */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
              style={{ backgroundColor: color }}
            >
              {ICONS.find(i => i.id === icon)?.emoji}
            </div>
            <div>
              <div className="font-medium text-gray-900">{name || '习惯名称'}</div>
              <div className="text-sm text-gray-500">{description || '描述'}</div>
            </div>
            <div className="ml-auto text-sm text-primary-600">
              {points > 0 ? `+${points}` : points}⭐
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50"
            >
              {loading ? '创建中...' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}