// TypeScript 类型定义

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Plan {
  id: string
  userId: string
  title: string
  description?: string
  category: 'study' | 'exercise' | 'habit' | 'other'
  color: string
  startDate: Date
  endDate?: Date
  frequency: 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom'
  customDays?: number[] // 0-6 表示周日到周六
  reminderTime?: string // HH:mm
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  
  // 关联数据
  checkIns?: CheckIn[]
  streak?: number
  todayCompleted?: boolean
}

export interface CheckIn {
  id: string
  planId: string
  userId: string
  date: Date
  completedAt?: Date
  note?: string
  duration?: number // 分钟
  createdAt: Date
  
  plan?: Plan
}

export interface PointHistory {
  id: string
  userId: string
  points: number
  reason: string
  createdAt: Date
}

export interface Stats {
  totalCheckIns: number
  totalPoints: number
  activePlans: number
  todayCheckIns: number
  currentStreak: number
  longestStreak: number
  weekStudyTime: number
}

export interface Achievement {
  id: string
  icon: string
  title: string
  description: string
  points: number
  unlocked: boolean
  progress?: number
  total?: number
}

// API 响应类型
export interface ApiResponse<T = unknown> {
  success?: boolean
  error?: string
  data?: T
}

// 表单类型
export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface PlanFormData {
  title: string
  description?: string
  category: Plan['category']
  color: string
  frequency: Plan['frequency']
  customDays?: number[]
  reminderTime?: string
  startDate?: Date
  endDate?: Date
}