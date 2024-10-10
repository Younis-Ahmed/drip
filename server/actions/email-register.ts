'use server';
import { RegisterSchema } from '@/types/register-schema';
import { createSafeActionClient } from 'next-safe-action';
import bcrypt from 'bcrypt';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { users } from '@/server/schema';

const actionController = createSafeActionClient();

export const emailRegister = actionController
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists in the database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
        if(existingUser?.emailVerified) {
            const verificationToken = 
        }
      return { error: "Email already in use" };
    }
    return { success: "success" };
    // Check if user has verified their email [TODO] - Implement email verification

    // if (!existingUser?.emailVerified) {

    // }

    // console.info({ email, password, name });
    // return { success: email };
  });
