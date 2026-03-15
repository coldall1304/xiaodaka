// 日期工具函数

/**
 * 格式化日期
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (format === 'relative') {
    return formatRelativeDate(d)
  }

  const options: Intl.DateTimeFormatOptions = format === 'long'
    ? { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
    : { year: 'numeric', month: '2-digit', day: '2-digit' }

  return d.toLocaleDateString('zh-CN', options)
}

/**
 * 相对时间格式化
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  if (days < 365) return `${Math.floor(days / 30)}个月前`
  return `${Math.floor(days / 365)}年前`
}

/**
 * 获取今天是周几
 */
export function getWeekday(date: Date = new Date()): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekdays[date.getDay()]
}

/**
 * 获取本周日期范围
 */
export function getWeekRange(date: Date = new Date()): { start: Date; end: Date } {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // 周一为第一天

  const start = new Date(d.setDate(diff))
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

/**
 * 获取本周所有日期
 */
export function getWeekDates(date: Date = new Date()): Date[] {
  const { start } = getWeekRange(date)
  const dates: Date[] = []

  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    dates.push(d)
  }

  return dates
}

/**
 * 判断是否是今天
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

/**
 * 判断是否是同一天
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2
  return d1.toDateString() === d2.toDateString()
}

/**
 * 计算连续天数
 */
export function calculateStreak(dates: (Date | string)[]): number {
  if (!dates.length) return 0

  const sortedDates = dates
    .map(d => typeof d === 'string' ? new Date(d) : d)
    .sort((a, b) => b.getTime() - a.getTime())

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const firstDate = new Date(sortedDates[0])
  firstDate.setHours(0, 0, 0, 0)

  // 如果最新的日期不是今天或昨天，连续天数为0
  const diffDays = Math.floor((today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays > 1) return 0

  let streak = 1
  let lastDate = firstDate

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i])
    currentDate.setHours(0, 0, 0, 0)

    const diff = Math.floor((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diff === 1) {
      streak++
      lastDate = currentDate
    } else if (diff > 1) {
      break
    }
  }

  return streak
}

/**
 * 格式化时长
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}分钟`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
}