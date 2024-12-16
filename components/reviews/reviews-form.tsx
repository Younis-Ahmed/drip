'use client'

import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  //   FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  //   FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { addReview } from '@/server/actions/add-review'
import { reviewsSchema } from '@/types/reviews-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Textarea } from '../ui/textarea'

export default function ReviewsForm() {
  const params = useSearchParams()
  const productID = Number(params.get('productID'))

  const form = useForm<z.infer<typeof reviewsSchema>>({
    resolver: zodResolver(reviewsSchema),
    defaultValues: {
      rating: 0,
      comment: '',
      // title: '',
      productID,
    },
  })

  const { execute, status } = useAction(addReview, {
    onSuccess({ data }) {
      if (!data)
        return
      if (data.error) {
        toast.error(data.error)
      }
      if (data.success) {
        toast.success(data.success)
        form.reset()
      }
    },
  })

  function onSubmit(data: z.infer<typeof reviewsSchema>) {
    execute({
      productID,
      rating: data.rating,
      comment: data.comment,
      // title: data.title,
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Button className="w-full font-medium" variant="secondary">
            Leave a review
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your review</FormLabel>
                  <FormControl>
                    <Textarea placeholder="How would you describe this product" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your rating</FormLabel>
                  <FormControl>
                    <Input type="hidden" placeholder="How would you rate this product" {...field} />
                  </FormControl>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => {
                      return (
                        <motion.div
                          className="relative cursor-pointer"
                          whileTap={{ scale: 0.8 }}
                          whileHover={{ scale: 1.2 }}
                          key={star}
                        >
                          <Star
                            key={star}
                            onClick={() => {
                              form.setValue('rating', star, { shouldValidate: true })
                            }}
                            className={cn(
                              'bg-transparent text-primary transition-all duration-300 ease-in-out',
                              form.getValues('rating') >= star ? 'fill-primary' : 'fill-muted',
                            )}
                          />
                        </motion.div>
                      )
                    })}
                  </div>
                </FormItem>
              )}
            />
            <Button disabled={status === 'executing'} className="w-full" type="submit">
              {status === 'executing' ? 'Adding review...' : 'Add review'}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
