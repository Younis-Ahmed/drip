import * as z from 'zod';

export const reviewsSchema = z.object({
    rating: z.number().int().min(1, {message: 'Please add at least one star'}).max(5, {message: 'Please add at most five stars'}),
    title: z.string().min(10, { message: 'Please add at least 10 characters for this review'}).max(100),
    // body: z.string().min(1).max(500),
})