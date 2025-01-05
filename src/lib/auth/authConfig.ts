import PostgresAdapter from '@auth/pg-adapter';
import NextAuth from 'next-auth';
import { pool } from '../../lib/postgres';
import Google from 'next-auth/providers/google';
import MailGun from 'next-auth/providers/mailgun';
import { clearStaleTokens } from '@/src/lib/auth/clearStaleTokenServerAction';
import { setName } from './setUserNameServerAction';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PostgresAdapter(pool),
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days (default)
  },
  pages: {
    signIn: '/auth/sign-in',
    verifyRequest: '/auth/auth-success',
    error: '/auth/auth-error',
  },
  providers: [
    Google({
      clientId: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID || '',
      clientSecret: process.env.NEXT_PUBLIC_AUTH_GOOGLE_SECRET || '',
      allowDangerousEmailAccountLinking: true, // Allows users to link multiple accounts with the same email address
    }),
    MailGun({
      apiKey: process.env.NEXT_PUBLIC_AUTH_MAILGUN_API_KEY || '',
      from: process.env.NEXT_PUBLIC_AUTH_MAILGUN_FROM || '',
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (trigger === 'update' && session?.name !== token?.name) {
        token.name = session.name;
        if (!token.name) {
          throw new Error('Name does not exist on token');
        }
        // Update the user's name in the database
        try {
          await setName(token.name);
        } catch (error) {
          throw new Error('Failed to update name', error);
        }
      }
      if (user) {
        await clearStaleTokens();
        token.id = user.id as string;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.id = token.id as string;
      return session;
    },
  },
});
