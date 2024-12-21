'use server'

import process from 'node:process'
import { newPasswordSchema } from '@/types/new-password-schema'
import { Pool } from '@neondatabase/serverless'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/neon-serverless'
import { createSafeActionClient } from 'next-safe-action'
import { db } from '..'
import { passwordResetTokens, users } from '../schema'
import { getPasswordResetTokenbyToken } from './tokens'

const action = createSafeActionClient()

export const newPassword = action
  .schema(newPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    // Working with webscokets to use transactions
    const pool = new Pool({ connectionString: process.env.POSTGRES_URL })

    const dbPool = drizzle(pool)
    // check the token and update the password
    if (!token) {
      return { error: 'Invalid token' }
    }

    // check if the token is valid
    const existingToken = await getPasswordResetTokenbyToken(token)
    if (!existingToken) {
      return { error: 'Invalid token' }
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if (hasExpired) {
      return { error: 'Token has expired' }
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    })

    if (!existingUser) {
      return { error: 'User not found' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await dbPool.transaction(async (db) => {
      await db
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, existingUser.id))

      await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id))
    })
    return { success: 'Password updated' }
  })
