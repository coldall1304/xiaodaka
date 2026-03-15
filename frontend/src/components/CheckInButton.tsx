'use client'

import { useState } from 'react'

interface CheckInButtonProps {
  planId: string
  planTitle: string
  isCheckedIn: boolean
  onCheckIn: (planId: string) => Promise<void>
}

export default function CheckInButton({
  planId,
  planTitle,
  isCheckedIn,
  onCheckIn,
}: CheckInButtonProps) {
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(isCheckedIn)
  const [showAnimation, setShowAnimation] = useState(false)

  const handleClick = async () => {
    if (checked || loading) return

    setLoading(true)
    try {
      await onCheckIn(planId)
      setChecked(true)
      setShowAnimation(true)
      setTimeout(() => setShowAnimation(false), 1500)
    } catch (error) {
      console.error('Check-in failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={checked || loading}
        className={`
          relative px-6 py-2 rounded-lg font-medium transition-all duration-300
          ${checked
            ? 'bg-green-100 text-green-600 cursor-default'
            : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 active:scale-95'
          }
          ${loading ? 'opacity-70 cursor-wait' : ''}
        `}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            打卡中...
          </span>
        ) : checked ? (
          <span className="flex items-center gap-2">
            ✓ 已打卡
          </span>
        ) : (
          '打卡'
        )}
      </button>

      {/* 打卡成功动画 */}
      {showAnimation && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm animate-bounce">
            +10 积分 🎉
          </div>
        </div>
      )}
    </div>
  )
}