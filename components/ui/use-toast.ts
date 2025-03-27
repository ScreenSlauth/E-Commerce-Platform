"use client"

import { useState, useEffect } from "react"

interface Toast {
  id: number
  title: string
  description?: string
  duration?: number
}

interface ToastOptions {
  title: string
  description?: string
  duration?: number
}

let toastId = 0

export function toast(options: ToastOptions) {
  const event = new CustomEvent("toast", {
    detail: {
      id: ++toastId,
      ...options,
      duration: options.duration || 3000,
    },
  })

  document.dispatchEvent(event)
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handleToast = (event: Event) => {
      const toast = (event as CustomEvent).detail as Toast
      setToasts((prev) => [...prev, toast])

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, toast.duration)
    }

    document.addEventListener("toast", handleToast)

    return () => {
      document.removeEventListener("toast", handleToast)
    }
  }, [])

  return { toasts }
}

