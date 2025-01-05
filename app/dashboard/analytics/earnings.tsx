'use client'

import type { TotalOrders } from '@/lib/infer-types'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge, Router } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function Earnings({ totalOrders }: { totalOrders: TotalOrders[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const filter = searchParams.get('filter') || 'week'


  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Revenue 0</CardTitle>
        <CardDescription>Here are your recent earnings</CardDescription>
        <div className="flex gap-2 items-center">
            <Badge onClick={() => router.push('/dashboard/analytics/?filter=week', { scroll: false })}
                className={cn('cursor-pointer', filter === 'week' ? 'bg-primary': 'bg-primary/25')}>
                This week
            </Badge>
            <Badge onClick={() => router.push('/dashboard/analytics/?filter=month', { scroll: false })}
                className={cn('cursor-pointer', filter === 'week' ? 'bg-primary': 'bg-primary/25')}>
                This month
            </Badge>
        </div>
      </CardHeader>
    </Card>
  )
}
