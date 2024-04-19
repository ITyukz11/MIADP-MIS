import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { sql } from '@vercel/postgres';

// Define your authentication options
const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        email:{},
        password:{}
      },
      async authorize(credentials, req) {

        console.log("Credentials: ", credentials?.password)
        const response = await sql`SELECT * FROM users WHERE email=${credentials?.email};`;

        const user = response.rows[0];
        console.log("response: ",response)
        console.log("user: ",user)

        const passwordCorrect = await compare(
          credentials?.password || '', 
          user.password)

          if(passwordCorrect){
            return{
              id: user.id,
              email: user.email,
              name: user.fullname
            }
          }
        return null

      }
    })
  ],
  pages: {
    signIn: "/auth/login" // Adjust this to your desired signIn page URL
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, authOptions);



