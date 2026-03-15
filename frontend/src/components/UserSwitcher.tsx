'use client'

import { useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface UserSwitcherProps {
  currentUser: User | null
  onSwitch: (user: User) => void
  onAddUser: () => void
}

export default function UserSwitcher({ currentUser, onSwitch, onAddUser }: UserSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [users] = useState<User[]>([
    // 模拟数据，实际应该从 API 获取
    currentUser || { id: '1', name: '测试用户', email: 'test@test.com' },
  ])

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
      >
        {currentUser?.avatar ? (
          <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-sm font-medium">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
        )}
        <span className="text-sm font-medium">{currentUser?.name || '用户'}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg py-2 z-20">
            <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-500 uppercase">
              切换用户
            </div>

            {users.map(user => (
              <button
                key={user.id}
                onClick={() => {
                  onSwitch(user)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 ${
                  currentUser?.id === user.id ? 'bg-primary-50' : ''
                }`}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="text-left">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                {currentUser?.id === user.id && (
                  <svg className="w-5 h-5 text-primary-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}

            <div className="border-t border-gray-100 mt-2 pt-2">
              <button
                onClick={() => {
                  onAddUser()
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-left text-sm text-primary-600 hover:bg-primary-50 flex items-center gap-2"
              >
                <span>➕</span>
                添加新用户
              </button>
              <button
                className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
              >
                <span>⚙️</span>
                管理用户
              </button>
              <button
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <span>🚪</span>
                退出登录
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}