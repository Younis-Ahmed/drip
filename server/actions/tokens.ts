'use sever'

import crypto from 'crypto'
import { eq } from 'drizzle-orm'
import { db } from '..'
import { emailTokens, passwordResetTokens, twoFactorTokens, users } from '../schema'

export async function getVerificationTokenByEmail(email: string) {
  try {
    const token = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.token, email),
    })

    return token
  }
  catch (error) {
    console.error(`error from tokens.ts: ${error}`)
    return null
  }
}

export async function generateEmailVerificationToken(email: string) {
  const token = crypto.randomUUID()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getVerificationTokenByEmail(email) // Check if token already exists

  if (existingToken) {
    try {
      await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))
    }
    catch (error) {
      console.error(`error from tokens.ts: ${error}`)
      return null
    }
  }

  const newToken = await db
    .insert(emailTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning()

  return newToken
}

export async function newVerification(token: string) {
  const existingToken = await getVerificationTokenByEmail(token)
  if (!existingToken)
    return { error: 'Invalid token' }

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
  await db.update(users).set({
    emailVerified: new Date(),
    email: existingToken.email,
  })

  await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))

  return { success: 'Email verified' }
}

export async function getPasswordResetTokenbyToken(token: string) {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    })

    return passwordResetToken
  }
  catch (error) {
    console.error(`error from tokens.ts: ${error}`)
    return null
  }
}

export async function getPasswordResetTokenbyEmail(email: string) {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.email, email),
    })

    return passwordResetToken
  }
  catch (error) {
    console.error(`error from tokens.ts: ${error}`)
    return null
  }
}
export async function getTwoFactorTokenByEmail(email: string) {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.email, email),
    })

    return twoFactorToken
  }
  catch (error) {
    console.error(`error from tokens.ts: ${error}`)
    return null
  }
}

export async function getTwoFactorTokenByToken(token: string) {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.token, token),
    })

    return twoFactorToken
  }
  catch (error) {
    console.error(`error from tokens.ts: ${error}`)
    return null
  }
}

export async function generatePasswordResetToken(email: string) {
  try {
    const token = crypto.randomUUID()

    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getPasswordResetTokenbyEmail(email)

    if (existingToken) {
      try {
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id))
      }
      catch (error) {
        console.error(`error from tokens.ts: ${error}`)
        return null
      }
    }
    const passwordResetToken = await db
      .insert(passwordResetTokens)
      .values({
        email,
        token,
        expires,
      })
      .returning()
    return passwordResetToken
  }
  catch (error) {
    console.error(`error from tokens.ts: ${error}`)
    return null
  }
}

export async function generateTwoFactorToken(email: string) {
  try {
    const token = crypto.randomInt(100_000, 1_000_000).toString()

    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getTwoFactorTokenByEmail(email)

    if (existingToken) {
      try {
        await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, existingToken.id))
      }
      catch (error) {
        console.error(`error from tokens.ts: ${error}`)
        return null
      }
    }
    const twoFactorToken = await db
      .insert(twoFactorTokens)
      .values({
        email,
        token,
        expires,
      })
      .returning()
    return twoFactorToken
  }
  catch (error) {
    console.error(`error from tokens.ts: ${error}`)
    return null
  }
}
