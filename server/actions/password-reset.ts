'use server'

import { ResetSchema } from '@/types/reset-schema'
import { eq } from 'drizzle-orm'
import { createSafeActionClient } from 'next-safe-action'
import { db } from '..'
import { users } from '../schema'
import { sendPasswordResetEmail } from './email'
import { generatePasswordResetToken } from './tokens'

const action = createSafeActionClient()

export const reset = action.schema(ResetSchema).action(async ({ parsedInput: { email } }) => {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (!existingUser) {
    return { error: 'User not found' }
  }

  const passwordResetToken = await generatePasswordResetToken(email)

  if (!passwordResetToken) {
    return { error: 'Error generating token' }
  }
  await sendPasswordResetEmail(passwordResetToken[0].email, passwordResetToken[0].token)

  return { success: 'Reset email sent' }
})
