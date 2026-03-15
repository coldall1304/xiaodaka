'use client'

import { useState } from 'react'

interface AIPlanModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerated: (plan: any) => void
}

export default function AIPlanModal({ isOpen, onClose, onGenerated }: AIPlanModalProps) {
  const [prompt, setPrompt] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<any>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('请输入计划描述')
      return
    }

    setLoading(true)
    setGeneratedPlan(null)

    try {
      const res = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, category }),
      })

      const data = await res.json()

      if (data.success) {
        setGeneratedPlan(data.plan)
        setSuggestions(data.suggestions || [])
      } else {
        alert(data.error || '生成失败')
      }
    } catch (error) {
      console.error('AI generate error:', error)
      alert('生成失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleUsePlan = () => {
    if (generatedPlan) {
      onGenerated({
        ...generatedPlan,
        startDate: new Date().toISOString(),
      })
      onClose()
      setPrompt('')
      setGeneratedPlan(null)
    }
  }

  const handleEditAndUse = () => {
    if (generatedPlan) {
      // 传递给父组件，打开编辑模态框
      onGenerated({
        ...generatedPlan,
        startDate: new Date().toISOString(),
        edit: true, // 标记需要编辑
      })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <h2 className="text-xl font-bold text-gray-900">AI 创建计划</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* 输入区域 */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述你想要养成的习惯或学习目标
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：我想每天背30个英语单词，提高英语水平"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              rows={3}
              maxLength={200}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {prompt.length}/200
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              选择分类（可选）
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: '', label: '自动' },
                { value: 'study', label: '📚 学习' },
                { value: 'exercise', label: '🏃 运动' },
                { value: 'habit', label: '💪 习惯' },
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

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                AI 生成中...
              </>
            ) : (
              <>
                <span>✨</span>
                AI 生成计划
              </>
            )}
          </button>
        </div>

        {/* 生成结果 */}
        {generatedPlan && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">✨ AI 为你生成</h3>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 mb-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">计划名称：</span>
                  <span className="font-medium text-gray-900">{generatedPlan.title}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">计划内容：</span>
                  <span className="text-gray-700">{generatedPlan.description}</span>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="text-sm text-gray-500">分类：</span>
                    <span className="text-gray-700">{generatedPlan.category}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">频率：</span>
                    <span className="text-gray-700">{generatedPlan.frequency}</span>
                  </div>
                </div>
                {generatedPlan.startTime && generatedPlan.endTime && (
                  <div>
                    <span className="text-sm text-gray-500">建议时间：</span>
                    <span className="text-gray-700">{generatedPlan.startTime} - {generatedPlan.endTime}</span>
                  </div>
                )}
              </div>
            </div>

            {/* AI 建议 */}
            {suggestions.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="text-sm font-medium text-blue-900 mb-2">💡 AI 建议</div>
                <ul className="text-sm text-blue-700 space-y-1">
                  {suggestions.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={() => setGeneratedPlan(null)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                重新生成
              </button>
              <button
                onClick={handleEditAndUse}
                className="flex-1 py-2 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50"
              >
                编辑后使用
              </button>
              <button
                onClick={handleUsePlan}
                className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                直接使用
              </button>
            </div>
          </div>
        )}

        {/* 示例提示 */}
        {!generatedPlan && !loading && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">试试这样说：</div>
            <div className="text-sm text-gray-500 space-y-1">
              <p>• 我想每天背30个英语单词</p>
              <p>• 我想养成每天早起的习惯</p>
              <p>• 我想每周运动3次，保持健康</p>
              <p>• 我想每天睡前阅读半小时</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}