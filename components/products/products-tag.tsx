'use client'

import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'

export default function ProductsTag() {
  return (
    <div>
      <Badge className={cn('cursor-pointer hover:opacity-100')}>
        All
      </Badge>
    </div>
  )
}
