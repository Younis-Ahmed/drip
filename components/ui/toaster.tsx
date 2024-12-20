'use client'

import { useTheme } from 'next-themes'
import { Toaster as IToaster } from 'sonner'

export default function Toaster() {
  const { theme } = useTheme()
  if (typeof theme === 'string') {
    return <IToaster richColors theme={theme as 'light' | 'dark' | 'system' | undefined} />
  }
}
