import { useState, useCallback } from 'react'

interface Plan {
  id: string
  title: string
  category: string
  color: string
  isActive: boolean
  frequency: string
  reminderTime?: string
  streak: number
  todayCompleted: boolean
}

interface UsePlansReturn {
  plans: Plan[]
  loading: boolean
  error: string | null
  fetchPlans: (userId: string) => Promise<void>
  addPlan: (data: Omit<Plan, 'id' | 'streak' | 'todayCompleted'>) => Promise<boolean>
  updatePlan: (id: string, data: Partial<Plan>) => Promise<boolean>
  deletePlan: (id: string) => Promise<boolean>
  checkIn: (planId: string) => Promise<boolean>
}

export function usePlans(): UsePlansReturn {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPlans = useCallback(async (userId: string) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/plans?userId=${userId}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '获取计划失败')
        return
      }

      setPlans(data.plans.map((p: any) => ({
        ...p,
        streak: 0, // TODO: 计算连续天数
        todayCompleted: p.checkIns?.length > 0,
      })))
    } catch (err) {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }, [])

  const addPlan = useCallback(async (data: Omit<Plan, 'id' | 'streak' | 'todayCompleted'>): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || '添加失败')
        return false
      }

      setPlans(prev => [...prev, {
        ...result.plan,
        streak: 0,
        todayCompleted: false,
      }])
      return true
    } catch (err) {
      setError('网络错误')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePlan = useCallback(async (id: string, data: Partial<Plan>): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/plans', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: id, ...data }),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || '更新失败')
        return false
      }

      setPlans(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
      return true
    } catch (err) {
      setError('网络错误')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const deletePlan = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/plans?planId=${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || '删除失败')
        return false
      }

      setPlans(prev => prev.filter(p => p.id !== id))
      return true
    } catch (err) {
      setError('网络错误')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const checkIn = useCallback(async (planId: string): Promise<boolean> => {
    setError(null)

    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userId: 'current-user', // TODO: 从 auth 获取
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '打卡失败')
        return false
      }

      // 更新计划状态
      setPlans(prev => prev.map(p => 
        p.id === planId 
          ? { ...p, todayCompleted: true, streak: p.streak + 1 }
          : p
      ))
      return true
    } catch (err) {
      setError('网络错误')
      return false
    }
  }, [])

  return { plans, loading, error, fetchPlans, addPlan, updatePlan, deletePlan, checkIn }
}