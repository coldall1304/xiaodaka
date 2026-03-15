import { useState, useEffect, useCallback } from 'react'

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
}

export function useStats(userId?: string): UseStatsReturn {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 自动加载统计数据
  useEffect(() => {
    if (userId) {
      setLoading(true)
      fetch(`/api/stats?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          setStats(data)
        })
        .catch(err => {
          console.error('Failed to fetch stats:', err)
          setError('获取统计失败')
        })
        .finally(() => setLoading(false))
    }
  }, [userId])

  return { stats, loading, error }
}