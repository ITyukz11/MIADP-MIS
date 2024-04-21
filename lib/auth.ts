import { NextAuthOptions } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import prisma from '@/lib/prisma';


export const authOptions: NextAuthOptions = {
    session: {
      strategy: 'jwt'
    },
    providers: [
      CredentialsProvider({
        type: 'credentials',
        credentials: {
          email: {},
          password: {}
        },
        async authorize(credentials, req) {
          try {
            const user = await prisma.user.findUnique({
              where: {
                email: credentials?.email
              }
            });
  
            if (!user) {
              throw new Error('User not found');
            }
  
            const passwordCorrect = await compare(
              credentials?.password || '',
              user.password
            );
  
            if (passwordCorrect) {
              return {
                id: user.id,
                email: user.email,
                name: user.name
              };
            }
  
            return null;
          } catch (error) {
            console.error('Error authorizing user:', error);
            return null;
          }
        }
      })
    ],
    pages: {
      signIn: '/auth/login', // Adjust this to your desired signIn page URL
      signOut:'/auth/login'
    }
  };