'use server';
import { loginSchema } from '@/types/login-schema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { users } from '@/server/schema';

const actionController = createSafeActionClient();

export const emailSignIn = actionController
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    // Check if user exists in the database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser?.email !== email) {
      return { error: 'User not found' };
    }

    // Check if user has verified their email [TODO] - Implement email verification
    
    // if (!existingUser?.emailVerified) {

    // }

    console.info(existingUser);
    return { success: email };
  });
