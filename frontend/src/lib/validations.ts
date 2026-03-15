import { z } from 'zod'

// 用户验证 schema
export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z.object({
  name: z.string().min(2, '用户名至少需要2个字符').max(50, '用户名最多50个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次密码输入不一致',
  path: ['confirmPassword'],
})

// 计划验证 schema
export const planSchema = z.object({
  title: z.string().min(1, '计划标题不能为空').max(100, '计划标题最多100个字符'),
  description: z.string().max(500, '描述最多500个字符').optional(),
  category: z.enum(['study', 'exercise', 'habit', 'other']).default('study'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '颜色格式无效').default('#3B82F6'),
  frequency: z.enum(['daily', 'weekdays', 'weekends', 'weekly', 'custom']).default('daily'),
  customDays: z.array(z.number().min(0).max(6)).optional(),
  reminderTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, '时间格式无效').optional(),
})

// 打卡验证 schema
export const checkInSchema = z.object({
  planId: z.string().min(1, '计划ID不能为空'),
  userId: z.string().min(1, '用户ID不能为空'),
  note: z.string().max(200, '备注最多200个字符').optional(),
  duration: z.number().min(0).max(1440, '时长不能超过24小时').optional(),
})

// 类型导出
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type PlanInput = z.infer<typeof planSchema>
export type CheckInInput = z.infer<typeof checkInSchema>

// 验证函数
export function validateLogin(data: unknown) {
  return loginSchema.safeParse(data)
}

export function validateRegister(data: unknown) {
  return registerSchema.safeParse(data)
}

export function validatePlan(data: unknown) {
  return planSchema.safeParse(data)
}

export function validateCheckIn(data: unknown) {
  return checkInSchema.safeParse(data)
}