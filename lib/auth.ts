import { NextAuthOptions } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import prisma from '@/lib/prisma';
import { UserRole } from "@prisma/client";
import { boolean } from "zod";

type CustomUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};


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
            // let passwordCorrect = false;
            // if(user.email == "admin@gmail.com"){
            //   passwordCorrect = await compare(
            //     credentials?.password || '',
            //     user.password
            //   );
            // }else{
            //   passwordCorrect =  credentials?.password == user.password
            // }

            const passwordCorrect = user.email == "admin@gmail.com"? credentials?.password ==user.password: await compare(credentials?.password || '',user.password);

            if (passwordCorrect) {
              console.log({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                region:user.region,
                component:user.component,
                unit:user.unit,
                position:user.position,
                expoPushToken:user.expoPushToken
              }
            
              )
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                region:user.region,
                component:user.component,
                unit:user.unit,
                position:user.position,
                expoPushToken:user.expoPushToken
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
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.role = user.role; // Include the 'role' property from the user object in the token
          token.id = user.id;
          token.region = user.region; 
          token.component = user.component; 
          token.unit = user.unit; 
          token.position = user.position; 
        }
        return token;
      },

      async session({ session, token }) {
        if(session?.user) 
          {
            session.user.role = token.role
            session.user.id = token.id
            session.user.region = token.region
            session.user.component = token.component
            session.user.unit = token.unit
            session.user.position = token.position; 
          }
        return session;
      },
    },
    
    
    pages: {
      signIn: '/auth/login', // Adjust this to your desired signIn page URL
      signOut:'/auth/login'
    }
  };