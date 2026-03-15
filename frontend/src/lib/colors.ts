// 颜色工具函数

/**
 * 预定义颜色
 */
export const COLORS = {
  blue: '#3B82F6',
  green: '#10B981',
  purple: '#8B5CF6',
  orange: '#F59E0B',
  red: '#EF4444',
  pink: '#EC4899',
  indigo: '#6366F1',
  teal: '#14B8A6',
} as const

export type ColorName = keyof typeof COLORS

/**
 * 获取分类默认颜色
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    study: COLORS.blue,
    exercise: COLORS.green,
    habit: COLORS.purple,
    other: COLORS.orange,
  }
  return colors[category] || COLORS.blue
}

/**
 * 获取随机颜色
 */
export function getRandomColor(): string {
  const colorNames = Object.keys(COLORS) as ColorName[]
  const randomName = colorNames[Math.floor(Math.random() * colorNames.length)]
  return COLORS[randomName]
}

/**
 * 十六进制转 RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * 计算对比色（黑/白）
 */
export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000000'
  
  // 计算亮度
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

/**
 * 颜色变淡
 */
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  const lighten = (value: number) => {
    const diff = 255 - value
    const newValue = value + diff * (percent / 100)
    return Math.round(newValue)
  }
  
  const r = lighten(rgb.r)
  const g = lighten(rgb.g)
  const b = lighten(rgb.b)
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/**
 * 颜色加深
 */
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  const darken = (value: number) => {
    const newValue = value * (1 - percent / 100)
    return Math.round(newValue)
  }
  
  const r = darken(rgb.r)
  const g = darken(rgb.g)
  const b = darken(rgb.b)
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}