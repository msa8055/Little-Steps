'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ChatRefresh() {
  const router = useRouter()
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') router.refresh()
    }, 5000)
    return () => clearInterval(timer)
  }, [router])
  return null
}
