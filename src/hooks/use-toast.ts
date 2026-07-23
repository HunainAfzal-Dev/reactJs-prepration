import { useState, useEffect } from "react"

export type ToastType = "success" | "error" | "info" | "warning" | "ai"

export interface ToastItem {
  id: string
  title: string
  description?: string
  type: ToastType
  duration?: number
}

type Listener = (toasts: ToastItem[]) => void
let memoryToasts: ToastItem[] = []
let listeners: Listener[] = []

const notify = () => {
  listeners.forEach((listener) => listener([...memoryToasts]))
}

export const toast = (title: string, description?: string, type: ToastType = "info", duration = 4000) => {
  const id = Math.random().toString(36).substring(2, 9)
  const newToast: ToastItem = { id, title, description, type, duration }
  memoryToasts.push(newToast)
  notify()

  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id)
    }, duration)
  }
  return id
}

export const dismissToast = (id: string) => {
  memoryToasts = memoryToasts.filter((t) => t.id !== id)
  notify()
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    setToasts(memoryToasts)
    const listener = (newToasts: ToastItem[]) => {
      setToasts(newToasts)
    }
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  return {
    toasts,
    toast,
    dismiss: dismissToast,
  }
}
export { toast as toastFn }
