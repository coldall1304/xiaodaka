import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始填充数据...')

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: '测试用户',
      password: hashedPassword,
    },
  })

  console.log('✅ 创建用户:', user.email)

  // 创建学习计划
  const plans = await Promise.all([
    prisma.plan.create({
      data: {
        userId: user.id,
        title: '每天背单词 30 个',
        category: 'study',
        color: '#3B82F6',
        startDate: new Date(),
        frequency: 'daily',
        reminderTime: '08:00',
      },
    }),
    prisma.plan.create({
      data: {
        userId: user.id,
        title: '晨跑 5 公里',
        category: 'exercise',
        color: '#10B981',
        startDate: new Date(),
        frequency: 'daily',
        reminderTime: '06:30',
      },
    }),
    prisma.plan.create({
      data: {
        userId: user.id,
        title: '阅读 30 分钟',
        category: 'study',
        color: '#8B5CF6',
        startDate: new Date(),
        frequency: 'daily',
        reminderTime: '21:00',
      },
    }),
  ])

  console.log('✅ 创建', plans.length, '个计划')

  // 创建一些打卡记录
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    for (const plan of plans) {
      // 随机决定是否打卡
      if (Math.random() > 0.2) {
        await prisma.checkIn.create({
          data: {
            planId: plan.id,
            userId: user.id,
            date,
            completedAt: new Date(date.getTime() + Math.random() * 12 * 60 * 60 * 1000),
            duration: Math.floor(Math.random() * 60) + 15,
          },
        })
      }
    }
  }

  console.log('✅ 创建打卡记录')

  // 创建积分记录
  await prisma.pointHistory.createMany({
    data: [
      { userId: user.id, points: 100, reason: '新用户注册奖励' },
      { userId: user.id, points: 50, reason: '连续7天打卡奖励' },
      { userId: user.id, points: 10, reason: '完成打卡' },
      { userId: user.id, points: 10, reason: '完成打卡' },
      { userId: user.id, points: 10, reason: '完成打卡' },
    ],
  })

  console.log('✅ 创建积分记录')

  console.log('🎉 数据填充完成!')
}

main()
  .catch((e) => {
    console.error('❌ 数据填充失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })