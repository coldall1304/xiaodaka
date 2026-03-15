'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const sections = [
    {
      id: 'start',
      title: '🚀 快速开始',
      content: `1. 注册账号并登录
2. 在 Dashboard 点击"新建"创建你的第一个学习计划
3. 设置计划名称、目标时间、提醒频率
4. 开始打卡，记录你的学习进度`,
    },
    {
      id: 'plan',
      title: '📋 学习计划',
      content: `- 支持创建多种类型的学习计划
- 可以设置每日/每周/自定义频率
- 支持设置提醒时间
- 可以批量添加多个计划`,
    },
    {
      id: 'habit',
      title: '💪 行为习惯',
      content: `- 习惯追踪功能帮你养成好习惯
- 支持自定义习惯目标
- 显示连续打卡天数
- 提供习惯完成率统计`,
    },
    {
      id: 'stats',
      title: '📊 图表统计',
      content: `- 查看学习时间趋势图
- 分析习惯完成率
- 查看打卡记录和连续天数
- 导出数据报告`,
    },
    {
      id: 'achievement',
      title: '🏆 积分成就',
      content: `- 完成打卡获得积分
- 解锁各种成就徽章
- 积分可以兑换奖励
- 等级系统激励持续学习`,
    },
    {
      id: 'tips',
      title: '💡 学习技巧',
      content: `1. 设定明确的学习目标
2. 保持规律的打卡习惯
3. 利用碎片时间学习
4. 定期回顾学习进度
5. 适当奖励自己的进步`,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header streak={7} totalPlans={15} userName="用户" />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* 简介 */}
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
          <h2 className="text-xl font-bold mb-2">欢迎使用小打卡 👋</h2>
          <p className="text-blue-100">
            小打卡是一个简单好用的学习打卡工具，帮助你养成好习惯，记录学习进度。
          </p>
        </Card>

        {/* FAQ 列表 */}
        <div className="space-y-3">
          {sections.map(section => (
            <Card key={section.id} className="overflow-hidden p-0">
              <button
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <span className="font-medium text-gray-900">{section.title}</span>
                <span className={`text-gray-400 transition-transform ${activeSection === section.id ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {activeSection === section.id && (
                <div className="px-6 py-4 border-t bg-gray-50">
                  <pre className="whitespace-pre-wrap text-gray-600 text-sm font-sans">
                    {section.content}
                  </pre>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* 联系方式 */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">需要更多帮助？</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-left">
              <span className="text-xl">📧</span>
              <div>
                <div className="font-medium text-gray-900">邮件反馈</div>
                <div className="text-sm text-gray-500">support@xiaodaka.com</div>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-left">
              <span className="text-xl">💬</span>
              <div>
                <div className="font-medium text-gray-900">在线客服</div>
                <div className="text-sm text-gray-500">工作日 9:00-18:00</div>
              </div>
            </button>
          </div>
        </Card>
      </main>
    </div>
  )
}