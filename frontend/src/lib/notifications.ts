/**
 * Notification utility for PWA reminders
 */

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

export function showNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon.png',
      badge: '/badge.png',
      ...options,
    })
  }
}

export interface ReminderSchedule {
  id: string
  title: string
  topic?: string
  date?: string
  time?: string
  daily: boolean
}

// Store reminders in localStorage
const REMINDERS_KEY = 'contentgen_reminders'

export function saveReminder(reminder: ReminderSchedule) {
  const reminders = getReminders()
  reminders.push(reminder)
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders))
  scheduleNotification(reminder)
}

export function getReminders(): ReminderSchedule[] {
  const stored = localStorage.getItem(REMINDERS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function removeReminder(id: string) {
  const reminders = getReminders().filter(r => r.id !== id)
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders))
}

export function scheduleNotification(reminder: ReminderSchedule) {
  if (!reminder.date || !reminder.time) {
    console.warn('Reminder missing date or time, cannot schedule notification')
    return
  }

  const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`)
  const now = new Date()
  const timeUntilReminder = reminderDateTime.getTime() - now.getTime()

  if (timeUntilReminder > 0) {
    setTimeout(() => {
      showNotification(`⏰ ${reminder.title}`, {
        body: reminder.topic ? `Topic: ${reminder.topic}` : 'ContentGen Reminder',
        tag: reminder.id,
        requireInteraction: true,
      })

      // If daily, schedule for next day
      if (reminder.daily) {
        const nextReminder = { ...reminder }
        const nextDate = new Date(reminderDateTime)
        nextDate.setDate(nextDate.getDate() + 1)
        nextReminder.date = nextDate.toISOString().split('T')[0]
        scheduleNotification(nextReminder)
      } else {
        // Remove one-time reminder after it fires
        removeReminder(reminder.id)
      }
    }, timeUntilReminder)

    console.log(`Reminder "${reminder.title}" scheduled for ${reminderDateTime.toLocaleString()}`)
  } else {
    console.warn(`Reminder "${reminder.title}" is in the past, skipping`)
  }
}

// Initialize and schedule all existing reminders on app load
export function initializeReminders() {
  const reminders = getReminders()
  reminders.forEach(reminder => scheduleNotification(reminder))
  console.log(`Initialized ${reminders.length} reminder(s)`)
}
