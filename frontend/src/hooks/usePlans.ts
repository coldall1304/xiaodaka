import { useState, useEffect, useCallback } from 'react'

interface Plan {
  id: string
  title: string
  description?: string
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
  addPlan: (data: any) => Promise<boolean>
  updatePlan: (id: string, data: Partial<Plan>) => Promise<boolean>
  deletePlan: (id: string) => Promise<boolean>
  checkIn: (planId: string) => Promise<boolean>
}

export function usePlans(userId?: string): UsePlansReturn {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 自动加载计划列表
  useEffect(() => {
    if (userId) {
      setLoading(true)
      fetch(`/api/plans?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.plans) {
            setPlans(data.plans.map((p: any) => ({
              ...p,
              streak: 0, // TODO: 计算连续天数
              todayCompleted: p.checkIns?.length > 0,
            })))
          }
        })
        .catch(err => {
          console.error('Failed to fetch plans:', err)
          setError('获取计划失败')
        })
        .finally(() => setLoading(false))
    }
  }, [userId])

  const addPlan = useCallback(async (data: any): Promise<boolean> => {
    if (!userId) return false

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId }),
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
  }, [userId])

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
    if (!userId) return false

    setError(null)

    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userId,
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
  }, [userId])

  return { plans, loading, error, addPlan, updatePlan, deletePlan, checkIn }
}