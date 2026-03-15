// 通知工具函数

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
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

export function sendNotification(title: string, options?: NotificationOptions): Notification | null {
  if (Notification.permission !== 'granted') {
    return null
  }
  return new Notification(title, options)
}

export function sendCheckInReminder(planTitle: string): Notification | null {
  return sendNotification('打卡提醒 🔔', {
    body: `别忘了完成今天的「${planTitle}」哦！`,
  })
}
