'use clinet'

import type { VariantsWithImagesTags } from '@/lib/infer-types'
import type * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createVariant } from '@/server/actions/create-variant'
import { deleteVariant } from '@/server/actions/delete-variant'
import { VariantSchema } from '@/types/variant-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { InputTags } from './input-tags'
import VariantImages from './variant-images'

export function ProductVariant({
  editMode,
  productID,
  variant,
  children,
}: {
  editMode: boolean
  productID?: number
  variant?: VariantsWithImagesTags
  children: React.ReactNode
}) {
  const form = useForm<z.infer<typeof VariantSchema>>({
    // mode: 'onBlur',
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      tags: [],
      variantImages: [],
      color: '#000000',
      editMode,
      id: undefined,
      productID,
      productType: 'black',
    },
  })
  const [open, setOpen] = useState(false)

  const setEdit = () => {
    if (!editMode) {
      form.reset()
      return
    }
    if (editMode && variant) {
      form.setValue('editMode', true)
      form.setValue('id', variant.id)
      form.setValue('productID', variant.productID)
      form.setValue('productType', variant.productType)
      form.setValue('color', variant.color)
      form.setValue(
        'tags',
        variant.variantsTags.map(tag => tag.tag),
      )
      form.setValue(
        'variantImages',
        variant.variantsImages.map(img => ({ name: img.name, size: img.size, url: img.url })),
      )
    }
  }

  useEffect(() => {
    setEdit()
  }, [])

  const { execute, status } = useAction(createVariant, {
    onExecute() {
      toast.loading('Creating variant')
      setOpen(false)
    },
    onSuccess({ data }) {
      if (data?.error)
        toast.error(data.error)
      if (data?.success)
        toast.success(data.success)
    },
    onSettled() {
      toast.dismiss()
      // form.reset();
    },
  })

  const variantAction = useAction(deleteVariant, {
    onExecute() {
      toast.loading('Deleting variant')
      setOpen(false)
    },
    onSuccess({ data }) {
      if (data?.error)
        toast.error(data.error)
      if (data?.success)
        toast.success(data.success)
    },
    onSettled() {
      toast.dismiss()
      // form.reset();
    },
  })

  function onSubmit(val: z.infer<typeof VariantSchema>) {
    execute(val)
  }
  // console.log('productID:', productID);
  // console.log('variant:', variant);
  // console.log('editMode:', editMode);

  // console.log('isValid:', form.formState.isValid);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-h-[860px] overflow-y-scroll rounded-md lg:max-w-screen-lg">
        <DialogHeader>
          <DialogTitle>
            {editMode ? 'Edit' : 'Create'}
            {' '}
            your variant
          </DialogTitle>
          <DialogDescription>
            Manage your product variants here. You can add tags, images, and more.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Pick a title for your variant" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Tags</FormLabel>
                  <FormControl>
                    <InputTags {...field} onChange={e => field.onChange(e)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <VariantImages />
            <div className="flex items-center justify-center gap-4">
              {editMode && variant && (
                <Button
                  disabled={variantAction.status === 'executing'}
                  variant="destructive"
                  onClick={(e) => {
                    e.preventDefault()
                    variantAction.execute({ id: variant.id })
                  }}
                  type="button"
                >
                  Delete Variant
                </Button>
              )}
              <Button
                disabled={
                  status === 'executing' || !form.formState.isValid || !form.formState.isDirty
                }
                type="submit"
              >
                {editMode ? 'Update Variant' : 'Create Variant'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ProductVariant
