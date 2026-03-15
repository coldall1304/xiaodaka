'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Card } from '@/components/Card'
import { HabitCard } from '@/components/HabitCard'

export default function HabitsPage() {
  const [habits, setHabits] = useState([
    { id: '1', name: '早起', icon: '🌅', streak: 7, target: '每天 6:00', completed: false },
    { id: '2', name: '阅读', icon: '📚', streak: 15, target: '每天 30 分钟', completed: true },
    { id: '3', name: '运动', icon: '🏃', streak: 3, target: '每周 3 次', completed: false },
    { id: '4', name: '冥想', icon: '🧘', streak: 21, target: '每天 10 分钟', completed: false },
  ])

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, completed: !h.completed } : h
    ))
  }

  const completedCount = habits.filter(h => h.completed).length

  return (
    <div className="min-h-screen bg-gray-50">
      <Header streak={7} totalPlans={4} userName="用户" />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* 概览 */}
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0">
          <h2 className="text-lg font-medium mb-4">今日习惯</h2>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold">{completedCount}/{habits.length}</div>
              <div className="text-purple-200 text-sm">已完成</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{Math.max(...habits.map(h => h.streak))}</div>
              <div className="text-purple-200 text-sm">最长连续</div>
            </div>
          </div>
        </Card>

        {/* 添加习惯 */}
        <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-purple-400 hover:text-purple-600 transition">
          ➕ 添加新习惯
        </button>

        {/* 习惯列表 */}
        <div className="space-y-3">
          {habits.map(habit => (
            <Card key={habit.id} className="p-4">
              <div className="flex items-center gap-4">
                {/* 完成状态 */}
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition ${
                    habit.completed
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 hover:bg-purple-100'
                  }`}
                >
                  {habit.completed ? '✓' : habit.icon}
                </button>

                {/* 习惯信息 */}
                <div className="flex-1">
                  <h3 className={`font-medium ${habit.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {habit.name}
                  </h3>
                  <p className="text-sm text-gray-500">{habit.target}</p>
                </div>

                {/* 连续天数 */}
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">{habit.streak}</div>
                  <div className="text-xs text-gray-500">连续天数</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}