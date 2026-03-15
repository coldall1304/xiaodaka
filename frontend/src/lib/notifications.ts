// 通知工具函数

// 请求通知权限
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

// 发送通知
export function sendNotification(title: string, options?: NotificationOptions): Notification | null {
  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted')
    return null
  }

  const notification = new Notification(title, {
    icon: '/icon.png',
    badge: '/badge.png',
    ...options,
  })

  return notification
}

// 发送打卡提醒
export function sendCheckInReminder(planTitle: string): Notification | null {
  return sendNotification('打卡提醒 🔔', {
    body: `别忘了完成今天的「${planTitle}」哦！`,
    tag: 'checkin-reminder',
    requireInteraction: true,
    actions: [
      { action: 'checkin', title: '立即打卡' },
      { action: 'snooze', title: '稍后提醒' },
    ],
  })
}

// 发送成就通知
export function sendAchievementNotification(achievementName: string, points: number): Notification | null {
  return sendNotification('恭喜获得成就！🏆', {
    body: `${achievementName} +${points}积分`,
    tag: 'achievement',
  })
}

// 发送连续打卡通知
export function sendStreakNotification(streak: number): Notification | null {
  return sendNotification('连续打卡成功！🔥', {
    body: `太棒了！你已经连续打卡 ${streak} 天了！`,
    tag: 'streak',
  })
}