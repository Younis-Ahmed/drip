'use server';

import { SettingsSchema } from '@/types/settings-schema';
import { createSafeActionClient } from 'next-safe-action';
import { auth } from '../auth';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { users } from '../schema';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';

const action = createSafeActionClient();

export const Settings = action.schema(SettingsSchema).action(async ({ parsedInput }) => {
  const user = await auth();
  if (!user) return { error: 'User not found' };
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.user.id),
  });
  if (!dbUser) return { error: 'User not found' };

  if (user.user.isOAuth) {
    parsedInput.email = undefined;
    parsedInput.password = undefined;
    parsedInput.newPassword = undefined;
    parsedInput.isTwoFactorEnabled = undefined;
  }

  if (parsedInput.password && parsedInput.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(parsedInput.password, dbUser.password);
    if (!passwordMatch) return { error: 'Invalid password' };

    const savePassword = await bcrypt.compare(parsedInput.newPassword, dbUser.password);

    if (savePassword) return { error: 'New password must be different' };

    const hashedPassword = await bcrypt.hash(parsedInput.newPassword, 10);

    parsedInput.password = hashedPassword;
    parsedInput.newPassword = undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updatedUser = await db
    .update(users)
    .set({
      name: parsedInput.name,
      password: parsedInput.password,
      twoFactorEnabled: parsedInput.isTwoFactorEnabled,
      email: parsedInput.email,
      image: parsedInput.image,
    })
    .where(eq(users.id, dbUser.id));
  revalidatePath('/dashboard/settings');

  return { success: 'Settings updated' };
});
