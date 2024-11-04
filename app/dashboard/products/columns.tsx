'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: number;
  title: string;
  price: number;
  image: string;
  variants: string[];
};

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
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price);
      return <div className='text-xs font-medium'>{formatted}</div>;
    },
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const image = row.getValue('image') as string;
      const alt = row.getValue('title') as string;
      return (
        <div>
          <Image src={image} alt={alt} width={50} height={50} className='rounded-md' />
        </div>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} className='h-8 w-8 p-0'>
                <MoreHorizontal className='h-4 w-4'/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            <DropdownMenuItem className='dark:focus:bg-muted focus:bg-primary/50 cursor-pointer'>Edit Product</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer'>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        );
    }
  },
];
