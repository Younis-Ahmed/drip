'use server'
import { twoFactorTokens, users } from '@/server/schema'
import { loginSchema } from '@/types/login-schema'
import { eq } from 'drizzle-orm'
import { AuthError } from 'next-auth'
import { signIn } from 'next-auth/react'
import { createSafeActionClient } from 'next-safe-action'
import { db } from '..'
import { sendTwoFactorTokenByEmail, sendVerficationEmail } from './email'
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from './tokens'

const actionController = createSafeActionClient()

export const emailSignIn = actionController
  .schema(loginSchema)

  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      // Check if user exists in the database
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      })

      if (existingUser?.email !== email) {
        return { error: 'User not found' }
      }

      // Check if user has verified their email [TODO] - Implement email verification

      if (!existingUser?.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(existingUser.email)
        if (verificationToken && verificationToken.length > 0) {
          await sendVerficationEmail(verificationToken[0].email, verificationToken[0].token)
          return { success: 'Verification email sent' }
        }
        else {
          return { error: 'Failed to generate verification token' }
        }
      }

      if (existingUser?.twoFactorEnabled && existingUser?.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

          if (!twoFactorToken) {
            return { error: 'Invalid Token' }
          }

          if (twoFactorToken.token !== code) {
            return { error: 'Invalid Token' }
          }

          const hasExpired = new Date(twoFactorToken.expires) < new Date()

          if (hasExpired) {
            return { error: 'Token has expired' }
          }

          await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, twoFactorToken.id))
        }
        else {
          const token = await generateTwoFactorToken(existingUser.email)

          if (!token) {
            return { error: 'Error generating token' }
          }

          await sendTwoFactorTokenByEmail(token[0].email, token[0].token)
          return { twoFactor: 'Two Factor Token sent' }
        }
      }

      await signIn('credentials', {
        email,
        password,
        redirectTo: '/',
      })

      console.info(existingUser)
      return { success: 'User Signed In!' }
    }
    catch (e) {
      console.error(e)
      if (e instanceof AuthError) {
        switch (e.type) {
          case 'OAuthSignInError':
            return { error: e.message }
          case 'OAuthCallbackError':
            return { error: e.message }
          case 'CredentialsSignin':
            return { error: e.message }
          default:
            return { error: 'Something went wrong' }
        }
      }
      throw e
    }
  })
