'use server';

import { newPasswordSchema } from '@/types/new-password-schema';
import { createSafeActionClient } from 'next-safe-action';
import { getPasswordResetTokenbyToken } from './tokens';
import { eq } from 'drizzle-orm';
import { passwordResetTokens, users } from '../schema';
import { db } from '..';
import bcrypt from 'bcrypt';

const action = createSafeActionClient();

export const newPassword = action
  .schema(newPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    // check the token and update the password
    if (!token) {
      return { error: 'Invalid token' };
    }

    // check if the token is valid
    const existingToken = await getPasswordResetTokenbyToken(token);
    if (!existingToken) {
      return { error: 'Invalid token' };
    }

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

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.transaction(async db => {
      await db
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, existingUser.id));

      await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id));
    });
    return { success: 'Password updated' };
  });
