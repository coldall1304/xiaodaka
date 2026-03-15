import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '小打卡 - 简单好用的学习打卡工具',
  description: '帮助你养成好习惯，记录学习进度',
  keywords: ['打卡', '学习', '习惯', '时间管理'],
  authors: [{ name: '火星 CTO' }],
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  )
}