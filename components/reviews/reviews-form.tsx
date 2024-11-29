'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
//   FormDescription,
  FormField,
  FormItem,
  FormLabel,
//   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'next/navigation';
import { reviewsSchema } from '@/types/reviews-schema';
import { Textarea } from '../ui/textarea';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';



export default function ReviewsForm() {
    const params = useSearchParams();
    const productID = Number(params.get('productID'));

    const form = useForm<z.infer<typeof reviewsSchema>>({
        resolver: zodResolver(reviewsSchema),
        defaultValues: {
            rating: 0,
            title: '',
            // body: '',
        }
    })

    function onSubmit(data: z.infer<typeof reviewsSchema>) {
        console.log(data); // TODO: send data to the server
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="w-full">
                    <Button className='font-medium w-full' variant={'secondary'}>Leave a review</Button>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <Form {...form}>
                    <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField 
                        control={form.control}
                        name='comment' 
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Leave your review</FormLabel>
                                <FormControl>
                                    <Textarea placeholder='How would you describe this product' {...field} />
                                </FormControl>
                            </FormItem>
                        )}/>
                        <FormField 
                        control={form.control}
                        name='rating' 
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Leave your rating</FormLabel>
                                <FormControl>
                                    <Input type='hidden' placeholder='How would you rate this product' {...field} />
                                </FormControl>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        return (
                                            <motion.div className='relative cursor-pointer'
                                            whileTap={{scale: 0.8}}
                                            whileHover={{ scale: 1.2 }}
                                            key={star}>
                                                <Star key={star} onClick={() => {
                                                    form.setValue('rating', star)
                                                    
                                                }}
                                                className={cn('text-primary bg-transparent transition-all duration-300 ease-in-out', form.getValues('rating') >= star ? 'text-primary' : 'text-muted')} />
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </FormItem>
                        )}/>
                        <Button className='w-full' type='submit'>Submit Review</Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}