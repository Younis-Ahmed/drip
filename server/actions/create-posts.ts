'use server';

import { post } from '@/server/schema';
import { db } from '@/server';
import { revalidatePath } from 'next/cache';

export default async function createPosts(formData: FormData) {
  const title = formData.get('title') as string;
  if (!title) throw new Error('Title is required');

  const posts = await db.insert(post).values({
    title,
  });
  if (!posts) throw new Error('Error creating post');

  revalidatePath('/');
}
