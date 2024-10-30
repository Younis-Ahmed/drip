import * as z from 'zod';

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  price: z.coerce.number({ invalid_type_error: 'Price must be a number'}).positive('Price must be a positive number'),
  description: z.string().min(30, 'Description must be at least 30 characters'),

}); 

export type zProductSchema = z.infer<typeof ProductSchema>;