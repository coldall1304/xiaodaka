'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'

export default function RegisterPage() {
  const router = useRouter()
  const { register, loading, error } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    if (password !== confirmPassword) {
      setLocalError('两次密码输入不一致')
      return
    }

    if (password.length < 6) {
      setLocalError('密码至少需要6个字符')
      return
    }

    const success = await register(name, email, password)
    if (success) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-lg mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">小打卡</h1>
          <p className="text-gray-600 mt-2">开启你的学习打卡之旅</p>
        </div>

        {/* 注册卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Tab 切换 */}
          <div className="flex border-b border-gray-200 mb-6">
            <Link
              href="/login"
              className="flex-1 py-3 text-center font-medium text-gray-500 hover:text-gray-700"
            >
              登录
            </Link>
            <button className="flex-1 py-3 text-center font-medium text-primary-600 border-b-2 border-primary-600">
              注册
            </button>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 用户名 */}
            <Input
              label="用户名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入用户名"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              required
            />

            {/* 邮箱 */}
            <Input
              label="邮箱"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱地址"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              required
            />

            {/* 密码 */}
            <Input
              label="密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码（至少6位）"
              required
            />

            {/* 确认密码 */}
            <Input
              label="确认密码"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入密码"
              required
            />

            {/* 错误提示 */}
            {(error || localError) && (
              <div className="text-red-500 text-sm text-center bg-red-50 py-3 rounded-lg">
                {localError || error}
              </div>
            )}

            {/* 注册按钮 */}
            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              注册
            </Button>
          </form>

          {/* 登录链接 */}
          <p className="text-center text-gray-600 mt-6">
            已有账号？{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              立即登录
            </Link>
          </p>

          {/* 用户协议 */}
          <p className="text-center text-xs text-gray-400 mt-4">
            注册即表示同意
            <Link href="/terms" className="text-primary-600 hover:underline"> 用户协议 </Link>
            和
            <Link href="/privacy" className="text-primary-600 hover:underline"> 隐私政策</Link>
          </p>
        </div>

        {/* 底部 */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2025 小打卡 · 让学习变得简单</p>
        </div>
      </div>
    </div>
  )
}