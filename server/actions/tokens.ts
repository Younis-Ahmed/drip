'use sever';

import { eq } from 'drizzle-orm';
import { db } from '..';
import { emailTokens, passwordResetTokens, users } from '../schema';

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const token = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.token, email),
    });

    return token;
  } catch (error) {
    console.error(`error from tokens.ts: ${error}`);
    return null;
  }
};

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email); // Check if token already exists

  if (existingToken) {
    try {
      await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
    } catch (error) {
      console.error(`error from tokens.ts: ${error}`);
      return null;
    }
  }

  const newToken = await db
    .insert(emailTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return newToken;
};

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByEmail(token);
  if (!existingToken) return { error: 'Invalid token' };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'Token has expired' };
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  });

  if (!existingUser) {
    return { error: 'User not found' };
  }
  await db.update(users).set({
    emailVerified: new Date(),
    email: existingToken.email,
  });

  await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));

  return { success: 'Email verified' };
};

export const getPasswordResetTokenbyToken = async (token: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });

    return passwordResetToken;
  } catch (error) {
    console.error(`error from tokens.ts: ${error}`);
    return null;
  }
};

export const getPasswordResetTokenbyEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.email, email),
    });

    return passwordResetToken;
  } catch (error) {
    console.error(`error from tokens.ts: ${error}`);
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  try {
    const token = crypto.randomUUID();

    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenbyEmail(token);

    if (existingToken) {
      try {
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id));
      } catch (error) {
        console.error(`error from tokens.ts: ${error}`);
        return null;
      }
    }
    const passwordResetToken = await db
      .insert(passwordResetTokens)
      .values({
        email,
        token,
        expires,
      })
      .returning();
    return passwordResetToken;
  } catch (error) {
    console.error(`error from tokens.ts: ${error}`);
    return null;
  }
};
