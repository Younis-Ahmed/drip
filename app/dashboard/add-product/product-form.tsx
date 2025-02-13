'use client'
import type { zProductSchema } from '@/types/product-schema'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  // CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createProduct } from '@/server/actions/create-product'
import { getProduct } from '@/server/actions/get-product'
import { ProductSchema } from '@/types/product-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { DollarSign } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { revalidatePath } from 'next/cache'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import Tiptap from './tiptap'

function ProductForm() {
  const form = useForm<zProductSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: '',
      price: 0,
      description: '',
    },
    mode: 'onChange',
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const editMode = searchParams.get('id')

  const checkProduct = async (id: number) => {
    if (editMode) {
      const { success, error } = await getProduct(id)
      if (error) {
        toast.error(error)
        revalidatePath('/dashboard/products')
        return
      }
      if (success) {
        const id = Number.parseInt(editMode)
        form.setValue('title', success.title)
        form.setValue('description', success.description)
        form.setValue('price', success.price)
        form.setValue('id', id)
      }
    }
  }

  useEffect(() => {
    if (editMode) {
      checkProduct(Number.parseInt(editMode))
    }
  }, [])

  const { execute, status } = useAction(createProduct, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error)
      }
      if (data?.success) {
        router.push('/dashboard/products')
        toast.success(data.success)
      }
    },
    onExecute: () => {
      toast.loading(editMode ? 'Updating Product' : 'Creating Product')
    },
    onSettled: () => {
      toast.dismiss()
      form.reset()
    },

  })

  async function onSubmit(data: zProductSchema) {
    execute(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? 'Edit Product' : 'Create Product'}</CardTitle>
        <CardDescription>
          {editMode ? 'Make changes to existing product' : 'Add a brand new product'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <DollarSign size={36} className="rounded-md bg-muted p-2" />
                      <Input
                        type="number"
                        placeholder="Your price in USD"
                        step={0.1}
                        min={0}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={
                status === 'executing' || !form.formState.isValid || !form.formState.isDirty
              }
              // className='w-full'
              type="submit"
            >
              {editMode ? 'Update Product' : 'Create Product'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ProductForm
