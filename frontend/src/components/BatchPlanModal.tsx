'use client'

import { useState } from 'react'

interface BatchPlan {
  title: string
  description: string
  category: string
  frequency: string
  color: string
}

interface BatchPlanModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated: () => void
}

export default function BatchPlanModal({ isOpen, onClose, onCreated }: BatchPlanModalProps) {
  const [plans, setPlans] = useState<BatchPlan[]>([
    { title: '', description: '', category: 'study', frequency: 'daily', color: '#3B82F6' }
  ])
  const [loading, setLoading] = useState(false)

  const addPlan = () => {
    if (plans.length >= 20) {
      alert('一次最多添加 20 个计划')
      return
    }
    setPlans([...plans, {
      title: '',
      description: '',
      category: 'study',
      frequency: 'daily',
      color: '#3B82F6'
    }])
  }

  const removePlan = (index: number) => {
    if (plans.length > 1) {
      setPlans(plans.filter((_, i) => i !== index))
    }
  }

  const updatePlan = (index: number, field: keyof BatchPlan, value: string) => {
    const updated = [...plans]
    updated[index] = { ...updated[index], [field]: value }
    setPlans(updated)
  }

  const handleSubmit = async () => {
    // 验证
    const validPlans = plans.filter(p => p.title.trim())
    if (validPlans.length === 0) {
      alert('请至少填写一个计划名称')
      return
    }

    setLoading(true)
    try {
      const userId = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')!).id
        : null

      if (!userId) {
        alert('请先登录')
        return
      }

      const res = await fetch('/api/plans/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          plans: validPlans.map(p => ({
            title: p.title,
            description: p.description,
            category: p.category,
            frequency: p.frequency,
            color: p.color,
          })),
        }),
      })

      const data = await res.json()

      if (data.success) {
        alert(`成功创建 ${data.count} 个计划`)
        onCreated()
        onClose()
        setPlans([{ title: '', description: '', category: 'study', frequency: 'daily', color: '#3B82F6' }])
      } else {
        alert(data.error || '创建失败')
      }
    } catch (error) {
      console.error('Batch create error:', error)
      alert('创建失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <h2 className="text-xl font-bold text-gray-900">批量添加计划</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="mb-4 text-sm text-gray-500">
          一次性添加多个学习计划，最多 20 个
        </div>

        {/* 计划列表 */}
        <div className="space-y-4 mb-6">
          {plans.map((plan, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
              {/* 删除按钮 */}
              {plans.length > 1 && (
                <button
                  onClick={() => removePlan(index)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  ✕
                </button>
              )}

              <div className="grid grid-cols-2 gap-3">
                {/* 计划名称 */}
                <div className="col-span-2">
                  <input
                    type="text"
                    value={plan.title}
                    onChange={(e) => updatePlan(index, 'title', e.target.value)}
                    placeholder="计划名称 *"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    maxLength={100}
                  />
                </div>

                {/* 描述 */}
                <div className="col-span-2">
                  <input
                    type="text"
                    value={plan.description}
                    onChange={(e) => updatePlan(index, 'description', e.target.value)}
                    placeholder="计划描述（可选）"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    maxLength={200}
                  />
                </div>

                {/* 分类 */}
                <div>
                  <select
                    value={plan.category}
                    onChange={(e) => updatePlan(index, 'category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  >
                    <option value="study">📚 学习</option>
                    <option value="exercise">🏃 运动</option>
                    <option value="habit">💪 习惯</option>
                    <option value="other">📌 其他</option>
                  </select>
                </div>

                {/* 频率 */}
                <div>
                  <select
                    value={plan.frequency}
                    onChange={(e) => updatePlan(index, 'frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  >
                    <option value="daily">每天</option>
                    <option value="weekdays">工作日</option>
                    <option value="weekends">周末</option>
                    <option value="weekly">每周</option>
                  </select>
                </div>

                {/* 颜色 */}
                <div className="col-span-2">
                  <div className="flex items-center gap-1 flex-wrap">
                    {colors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => updatePlan(index, 'color', color)}
                        className={`w-6 h-6 rounded-full border-2 ${
                          plan.color === color ? 'border-gray-800 scale-110' : 'border-transparent'
                        } transition`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* 序号 */}
              <div className="absolute bottom-2 left-2 text-xs text-gray-400">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* 添加按钮 */}
        <button
          onClick={addPlan}
          className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-primary-500 hover:text-primary-600 transition mb-6"
        >
          + 添加更多计划 ({plans.length}/20)
        </button>

        {/* 快速填充模板 */}
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-2">快速填充模板：</div>
          <div className="flex flex-wrap gap-2">
            {[
              '每天背单词30个',
              '每天阅读30分钟',
              '每天运动1小时',
              '每天早起6点',
              '每天冥想10分钟',
            ].map(template => (
              <button
                key={template}
                onClick={() => {
                  if (plans.length < 20) {
                    setPlans([...plans, {
                      title: template,
                      description: '',
                      category: template.includes('运动') ? 'exercise' : 'study',
                      frequency: 'daily',
                      color: colors[Math.floor(Math.random() * colors.length)]
                    }])
                  }
                }}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
              >
                + {template}
              </button>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || plans.filter(p => p.title.trim()).length === 0}
            className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '创建中...' : `批量创建 (${plans.filter(p => p.title.trim()).length} 个)`}
          </button>
        </div>
      </div>
    </div>
  )
}