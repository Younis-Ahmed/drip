'use server';
import { RegisterSchema } from '@/types/register-schema';
import { createSafeActionClient } from 'next-safe-action';
import bcrypt from 'bcrypt';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { users } from '@/server/schema';
import { generateEmailVerificationToken } from './tokens';
import { sendVerficationEmail } from './email';

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
      if (existingUser?.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        // Send verification email
        if (verificationToken && verificationToken[0]) {
          await sendVerficationEmail(verificationToken[0].email, verificationToken[0].token);
        } else {
          return { error: 'Failed to generate verification token' };
        }

        return { success: 'Email Confirmation resent' };
      }
      return { error: 'Email already in use' };
    }

    try {
      // Logic to create user
      await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
      });
    } catch (error) {
      return { error: `Error from email-register.ts: ${error} ` };
    }

    const verificationToken = await generateEmailVerificationToken(email);

    // Send verification email
    if (verificationToken && verificationToken[0]) {
    await sendVerficationEmail(verificationToken[0].email, verificationToken[0].token);
    }

    return { success: 'Confirmation email sent' };
  });
