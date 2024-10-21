'use server';
import { loginSchema } from '@/types/login-schema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { users } from '@/server/schema';
import { generateEmailVerificationToken } from './tokens';
import { sendVerficationEmail } from './email';
import { signIn } from 'next-auth/react';
import { AuthError } from 'next-auth';

const actionController = createSafeActionClient();

export const emailSignIn = actionController
  .schema(loginSchema)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      // Check if user exists in the database
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser?.email !== email) {
        return { error: 'User not found' };
      }

      // Check if user has verified their email [TODO] - Implement email verification

      if (!existingUser?.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(existingUser.email);
        if (verificationToken && verificationToken.length > 0) {
          await sendVerficationEmail(verificationToken[0].email, verificationToken[0].token);
          return { success: 'Verification email sent' };
        } else {
          return { error: 'Failed to generate verification token' };
        }
      }

      await signIn('credentials', {
        email,
        password,
        redirectTo: '/',
      });

      console.info(existingUser);
      return { success: 'User Signed In!' };
    } catch (e) {
      console.error(e);
      if (e instanceof AuthError) {
        switch (e.type) {
          case 'OAuthSignInError':
            return { error: e.message };
          case 'OAuthCallbackError':
            return { error: e.message };
          case 'CredentialsSignin':
            return { error: e.message };
          default:
            return { error: 'Something went wrong' };
        }
      }
      throw e;
    }
  });
