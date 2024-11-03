'use client';

import { Toaster as IToaster } from 'sonner';
import { useTheme } from 'next-themes';

export default function Toaster() {
  const { theme } = useTheme();
  if (typeof theme === 'string') {
    return <IToaster richColors theme={theme as 'light' | 'dark' | 'system' | undefined} />;
  }
}
