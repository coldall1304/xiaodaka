import { useState, useCallback } from 'react'

interface Stats {
  totalCheckIns: number
  totalPoints: number
  activePlans: number
  todayCheckIns: number
  currentStreak: number
  longestStreak: number
  weekStudyTime: number
}

interface UseStatsReturn {
  stats: Stats | null
  loading: boolean
  error: string | null
  fetchStats: (userId: string) => Promise<void>
}

export function useStats(): UseStatsReturn {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async (userId: string) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/stats?userId=${userId}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '获取统计失败')
        return
      }

      setStats(data)
    } catch (err) {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }, [])

  return { stats, loading, error, fetchStats }
}