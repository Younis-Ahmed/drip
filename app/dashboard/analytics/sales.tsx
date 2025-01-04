import type { TotalOrders } from '@/lib/infer-types'
import UserPlaceholder from '@/assets/images/person-placeholder.png'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'

export default function Sales({ totalOrders }: { totalOrders: TotalOrders[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Sales</CardTitle>
        <CardDescription>Here are your recent sales</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalOrders.map(order => (
              <TableRow key={order.id} className='font-medium'>
                <TableCell>
                  {order.order.user.image && order.order.user.name
                    ? (
                        <div className="flex  gap-2 items-center">
                          <Image src={order.order.user.image} alt={order.order.user.name} width={25} height={25} className="rounded-full" />
                          <p className="text-xs font-medium">{order.order.user.name}</p>
                        </div>
                      )
                    : (
                        <div className="flex items-center gap-2 justify-center">
                          <Image src={UserPlaceholder} alt="User not found" width={25} height={25} className="rounded-full" />
                          <p className="text-xs font-medium">User not found.</p>
                        </div>
                      )}
                </TableCell>
                <TableCell>
                  {order.product.title}
                </TableCell>
                <TableCell>
                  $
                  {order.product.price}
                </TableCell>
                <TableCell>
                  {order.quantity}
                </TableCell>
                <TableCell>
                  <Image src={order.productVariants.variantsImages[0].url} width={48} height={48} alt={order.product.title} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
