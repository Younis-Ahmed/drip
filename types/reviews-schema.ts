import * as z from 'zod';

export const reviewsSchema = z.object({
  productID: z.number().int(),
  rating: z
    .number()
    .int()
    .min(1, { message: 'Please add at least one star' })
    .max(5, { message: 'Please add at most five stars' }),
  title: z
    .string()
    .min(10, { message: 'Please add at least 10 characters for this review' })
    .max(100),
  comment: z.string().min(50, { message: 'Please add at least 50 characters for this review' }),
});
