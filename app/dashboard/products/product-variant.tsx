'use clinet';

import { VariantsWithImagesTags } from '@/lib/infer-types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { VariantSchema } from '@/types/variant-schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputTags } from './input-tags';
import VariantImages from './variant-images';

function onSubmit(val: z.infer<typeof VariantSchema>) {
  console.log(val);
}
export const ProductVariant = ({
  editMode,
  productID,
  variant,
  children,
}: {
  editMode: boolean;
  productID?: number;
  variant?: VariantsWithImagesTags;
  children: React.ReactNode;
}) => {
  const form = useForm<z.infer<typeof VariantSchema>>({
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
  });
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='max-h-[860px] overflow-y-scroll rounded-md lg:max-w-screen-lg'>
        <DialogHeader>
          <DialogTitle>{editMode ? 'Edit' : 'Create'} your variant</DialogTitle>
          <DialogDescription>
            Manage your product variants here. You can add tags, images, and more.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='productType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Pick a title for your variant' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='color'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Color</FormLabel>
                  <FormControl>
                    <Input type='color' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='tags'
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
            {editMode && variant && (
              <Button className='' onClick={e => e.preventDefault()} type='button'>
                Delete Variant
              </Button>
            )}
            <Button type='submit'>{editMode ? 'Update Variant' : 'Create Variant'}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ProductVariant;
