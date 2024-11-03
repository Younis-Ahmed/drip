'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
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
import { useForm } from 'react-hook-form';
import { ProductSchema, zProductSchema } from '@/types/product-schema';
import { DollarSign } from 'lucide-react';
import Tiptap from './tiptap';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { createProduct } from '@/server/actions/create-product';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function ProductForm() {
  const form = useForm<zProductSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: '',
      price: 0,
      description: '',
    },
    mode: 'onChange',
  });

  const router = useRouter();

  const { execute, status } = useAction(createProduct, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        router.push('/dashboard/products');
        toast.success(data.success);
      }
    },
    onError: () => {
      console.error('Product creation failed');
    },
    onExecute: () => {
      toast.loading('Creating Product');
    },
  });

  async function onSubmit(data: zProductSchema) {
    execute(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Your Title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
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
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-2'>
                      <DollarSign size={36} className='rounded-md bg-muted p-2' />
                      <Input
                        type='number'
                        placeholder='Your price in USD'
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
              type='submit'
            >
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}

export default ProductForm;
