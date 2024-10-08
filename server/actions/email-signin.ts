'use server';
import { loginSchema } from '@/types/login-schema';
import { createSafeActionClient } from 'next-safe-action';

const actionController = createSafeActionClient();

export const emailSignIn = actionController
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    console.log(email, password, code);
    return { email, password, code };
  });
