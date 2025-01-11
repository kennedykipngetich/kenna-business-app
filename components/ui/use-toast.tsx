import { useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, variant = 'default' }: { title: string; description: string; variant?: 'default' | 'destructive' }) => {
    const id = Date.now()
    const type: ToastType = variant === 'destructive' ? 'error' : 'success'
    const newToast: Toast = { id, message: `${title}: ${description}`, type }
    setToasts((currentToasts) => [...currentToasts, newToast])

    // Automatically remove the toast after 5 seconds
    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  return { toast, toasts }
}

