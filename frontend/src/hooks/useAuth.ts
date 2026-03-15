import { useState, useEffect, useCallback } from 'react'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface UseAuthReturn {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (data: Partial<User>) => Promise<boolean>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 检查本地存储的用户信息
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '登录失败')
        return false
      }

      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      return true
    } catch (err) {
      setError('网络错误，请重试')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '注册失败')
        return false
      }

      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      return true
    } catch (err) {
      setError('网络错误，请重试')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('user')
    // 可以调用 logout API
  }, [])

  const updateUser = useCallback(async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false

    setLoading(true)
    setError(null)

    try {
      // TODO: 调用更新 API
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      return true
    } catch (err) {
      setError('更新失败')
      return false
    } finally {
      setLoading(false)
    }
  }, [user])

  return { user, loading, error, login, register, logout, updateUser }
}