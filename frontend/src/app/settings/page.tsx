'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    username: '用户',
    email: 'user@example.com',
    notifications: true,
    reminderTime: '09:00',
    darkMode: false,
    language: 'zh-CN',
  })
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header streak={7} totalPlans={15} userName={settings.username} />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* 个人信息 */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">个人信息</h2>
          <div className="space-y-4">
            <Input
              label="用户名"
              value={settings.username}
              onChange={(e) => setSettings({ ...settings, username: e.target.value })}
            />
            <Input
              label="邮箱"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />
          </div>
        </Card>

        {/* 提醒设置 */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">提醒设置</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">开启提醒</p>
                <p className="text-sm text-gray-500">每日打卡提醒通知</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.notifications ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <Input
              label="默认提醒时间"
              type="time"
              value={settings.reminderTime}
              onChange={(e) => setSettings({ ...settings, reminderTime: e.target.value })}
            />
          </div>
        </Card>

        {/* 显示设置 */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">显示设置</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">深色模式</p>
                <p className="text-sm text-gray-500">切换深色主题</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.darkMode ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">语言</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="zh-CN">简体中文</option>
                <option value="zh-TW">繁體中文</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </Card>

        {/* 数据管理 */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">数据管理</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              📤 导出数据
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              📥 导入数据
            </button>
            <button className="w-full text-left px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
              🗑️ 清除所有数据
            </button>
          </div>
        </Card>

        {/* 保存按钮 */}
        <Button onClick={handleSave} className="w-full">
          {saved ? '✓ 已保存' : '保存设置'}
        </Button>

        {/* 版本信息 */}
        <div className="text-center text-sm text-gray-500">
          <p>小打卡 v1.0.0</p>
        </div>
      </main>
    </div>
  )
}