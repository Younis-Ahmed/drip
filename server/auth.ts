import NextAuth from 'next-auth';
import dotenv from 'dotenv';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/server';
import Google from 'next-auth/providers/google';
import Twitter from 'next-auth/providers/twitter';


dotenv.config({
  path: '.env.local',
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  providers: [
    // Providers
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Twitter({ // TODO: Twitter Token needs a website to be set up
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
});
