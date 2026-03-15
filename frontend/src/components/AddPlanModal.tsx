'use client'

import { useState, useRef } from 'react'

interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
}

interface AddPlanModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (plan: any) => void
}

export default function AddPlanModal({ isOpen, onClose, onAdd }: AddPlanModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('study')
  const [frequency, setFrequency] = useState('daily')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [enableTime, setEnableTime] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 处理文件上传
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // 限制最多3个附件
    if (attachments.length + files.length > 3) {
      alert('最多只能上传3个附件')
      return
    }

    for (const file of Array.from(files)) {
      // 验证文件大小（50MB）
      if (file.size > 50 * 1024 * 1024) {
        alert(`文件 ${file.name} 超过 50MB 限制`)
        continue
      }

      // 添加到列表（模拟上传）
      const attachment: Attachment = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file), // 本地预览
      }
      setAttachments(prev => [...prev, attachment])
    }

    // 清空 input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 删除附件
  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id))
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // 获取文件图标
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️'
    if (type.startsWith('audio/')) return '🎵'
    if (type.startsWith('video/')) return '🎬'
    if (type === 'application/pdf') return '📄'
    return '📎'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const plan: any = {
        title,
        description,
        category,
        frequency,
        startDate: new Date(startDate).toISOString(),
        attachments: attachments.map(a => ({
          id: a.id,
          name: a.name,
          type: a.type,
          size: a.size,
          url: a.url,
        })),
      }

      if (enableTime) {
        plan.reminderTime = startTime
        plan.startTime = startTime
        plan.endTime = endTime
      }

      onAdd(plan)
      onClose()
      setTitle('')
      setDescription('')
      setAttachments([])
    } catch (error) {
      console.error('Failed to add plan:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">添加学习计划</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 起始日期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📅 起始日期
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 选择计划的起始日期，默认为今天
            </p>
          </div>

          {/* 计划名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              计划名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：每天背单词30个"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              required
              maxLength={100}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>限制 1-100 字</span>
              <span>{title.length}/100</span>
            </div>
          </div>

          {/* 计划内容 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              计划内容 <span className="text-gray-400">(可选)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例如：利用晨读时间，结合课本 Unit1 单词表"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              rows={3}
              maxLength={1000}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>限制 0-1000 字</span>
              <span>{description.length}/1000</span>
            </div>
          </div>

          {/* 分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分类 <span className="text-red-500">*</span>
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
              重复频率 <span className="text-red-500">*</span>
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
              <option value="once">仅当天</option>
            </select>
          </div>

          {/* 时间设置 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                ⏰ 时间设置 <span className="text-gray-400">(可选)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={enableTime}
                  onChange={(e) => setEnableTime(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600">启用</span>
              </label>
            </div>
            
            {enableTime && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">开始时间</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">结束时间</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  💡 设置计划的固定时间段，如 19:00-20:30
                </p>
              </div>
            )}
          </div>

          {/* 附件上传 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📎 附件 <span className="text-gray-400">(可选，最多3个)</span>
            </label>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 transition"
            >
              <div className="text-4xl mb-2">📤</div>
              <p className="text-sm text-gray-600">点击上传或拖拽文件到此处</p>
              <p className="text-xs text-gray-400 mt-1">
                支持图片、音频、视频、PDF（单个最大50MB）
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,audio/*,video/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* 已上传的附件列表 */}
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map(file => (
                  <div key={file.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                      <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(file.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
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