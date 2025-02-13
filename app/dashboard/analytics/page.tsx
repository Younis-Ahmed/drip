import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { db } from '@/server'
import { orderProduct } from '@/server/schema'
import { desc } from 'drizzle-orm'
import Earnings from './earnings'
import Sales from './sales'

export const revalidate = 0

export default async function Analytics() {
  const totalOrders = await db.query.orderProduct.findMany({
    orderBy: [desc(orderProduct.id)],
    limit: 10,
    with: {
      order: { with: { user: true } },
      product: true,
      productVariants: { with: { variantsImages: true } },
    },
  })

  if (totalOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Orders</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (totalOrders) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Analytics</CardTitle>
          <CardDescription>
            Check your sales, New customers, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Sales totalOrders={totalOrders} />
          <Earnings totalOrders={totalOrders} />
        </CardContent>
      </Card>
    )
  }
}
