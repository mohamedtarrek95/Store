import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from './db';
import User from '@/models/User';

const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password required');
          }

          await dbConnect();

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error('Invalid email or password');
          }

          const isPassword = await bcrypt.compare(credentials.password as string, user.password);

          if (!isPassword) {
            throw new Error('Invalid email or password');
          }

          const result = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            isAdmin: user.isAdmin,
          };
          console.log('[AUTH] authorize returning:', { ...result, password: '[REDACTED]' });
          return result;
        } catch (error) {
          console.error('Auth authorize error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = (user as any).isAdmin;
        token.id = user.id;
      }
      console.log('[AUTH] jwt callback token:', { ...token, isAdmin: token.isAdmin });
      return token;
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          (session.user as any).isAdmin = token.isAdmin;
          (session.user as any).id = token.id;
        }
        console.log('[AUTH] session callback session:', { ...session, user: { ...session.user, isAdmin: (session.user as any)?.isAdmin, id: (session.user as any)?.id } });
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export const { GET, POST } = handlers;
export { auth, signIn, signOut };
