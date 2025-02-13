'use client'

import type { VariantsWithImagesTags } from '@/lib/infer-types'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { deleteProduct } from '@/server/actions/delete-product'
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { ProductVariant } from './product-variant'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface ProductColumn {
  id: number
  title: string
  price: number
  image: string
  variants: VariantsWithImagesTags[]
}

function ActionCell({ row }: { row: Row<ProductColumn> }) {
  const { execute } = useAction(deleteProduct, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error)
      }
      if (data?.success) {
        toast.success(data.success)
      }
    },
    onExecute: () => {
      toast.loading('Deleting product...')
    },
  })
  const product = row.original

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
        <DropdownMenuItem className="cursor-pointer focus:bg-primary/50 dark:focus:bg-muted">
          <Link href={`/dashboard/add-product?id=${product.id}`}>Edit Product</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => execute({ id: product.id })}
          className="cursor-pointer focus:bg-destructive/50 dark:focus:bg-destructive"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'variants',
    header: 'Variants',
    cell: ({ row }) => {
      const variants = row.getValue('variants') as VariantsWithImagesTags[]
      return (
        <div className="flex gap-2">
          {variants.map(variant => (
            <div key={variant.id}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ProductVariant editMode={true} productID={row.original.id} variant={variant}>
                      <div
                        className="h-5 w-5 rounded-full"
                        key={variant.id}
                        style={{ background: variant.color }}
                      />
                    </ProductVariant>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{variant.productType}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <ProductVariant editMode={false} productID={row.original.id}>
                    <PlusCircle className="h-5 w-5" />
                  </ProductVariant>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new variant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue('price'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price)
      return <div className="text-xs font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const image = row.getValue('image') as string
      const alt = row.getValue('title') as string
      return (
        <div>
          <Image src={image} alt={alt} width={50} height={50} className="rounded-md" />
        </div>
      )
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ActionCell,
  },
]
