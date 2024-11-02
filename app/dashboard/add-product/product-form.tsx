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
import { zProductSchema } from '@/types/product-schema';
import { DollarSign } from 'lucide-react';
import Tiptap from './tiptap';

function ProductForm() {
  const form = useForm<zProductSchema>({
    defaultValues: {
      title: '',
      price: 0,
      description: '',
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={() => console.log('hey')} className='space-y-8'>
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
                    <Tiptap val={field.value}/>
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
            <Button className='w-full' type='submit'>
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
