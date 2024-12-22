import * as z from 'zod'

export const loginSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 6 characters long',
  }),
  code: z.optional(z.string()),
})
