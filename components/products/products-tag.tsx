'use client'

import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Badge } from '../ui/badge'

export default function ProductsTag() {
  const router = useRouter()
  const setFilter = (tag: string) => {
    if (tag)
      router.push(`?tag=${tag}`)

    if (!tag)
      router.push('/')
  }
  return (
    <div>
      <Badge
        onClick={() => setFilter('')}
        className={cn('cursor-pointer hover:opacity-100')}
      >
        All
      </Badge>
    </div>
  )
}
