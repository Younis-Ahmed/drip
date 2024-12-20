'use client'

import type { VariantsWithProduct } from '@/lib/infer-types'
import formatPrice from '@/lib/format-price'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '../ui/badge'

interface ProductTypes {
  variants: VariantsWithProduct[]
}

export default function Products({ variants }: ProductTypes) {
  return (
    <main className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {variants.map(variant => (
        <Link
          className="py-2"
          key={variant.id}
          href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantsImages[0].url}`}
        >
          <Image
            className="rounded-md pb-2"
            src={variant.variantsImages[0].url}
            width={720}
            height={480}
            alt={variant.product.title}
            loading="lazy"
          />
          <div className="flex justify-between">
            <div className="font-medium">
              <h2>{variant.product.title}</h2>
              <p className="text-sm text-muted-foreground">{variant.productType}</p>
            </div>
            <div>
              <Badge className="text-sm" variant="secondary">
                {formatPrice(variant.product.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </main>
  )
}
