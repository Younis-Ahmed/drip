import NextAuth from 'next-auth';
import dotenv from 'dotenv';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/server';
import Google from 'next-auth/providers/google';
import Twitter from 'next-auth/providers/twitter';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from '@/types/login-schema';
import { eq } from 'drizzle-orm';
import { accounts, users } from './schema';
import bcrypt from 'bcrypt';

dotenv.config({
  path: '.env.local',
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        session.user.role = token.role as string;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.image = token.image as string;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const exsitingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
      });

      if (!exsitingUser) return token;

      const exsitingAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, exsitingUser.id),
      });

      token.isOAuth = !!exsitingAccount;
      token.name = exsitingUser.name;
      token.email = exsitingUser.email;
      token.role = exsitingUser.role;
      token.isTwoFactorEnabled = exsitingUser.twoFactorEnabled;
      token.image = exsitingUser.image;

      return token;
    },
  },
  providers: [
    // Providers
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Twitter({
      // TODO: Twitter Token needs a website to be set up
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      authorize: async credentials => {
        const validatedFields = loginSchema.safeParse(credentials);
        if (!validatedFields.success || !validatedFields.data) {
          return null;
        }
        const { email, password } = validatedFields.data;
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) return null;

        return user;
      },
    }),
  ],
});
