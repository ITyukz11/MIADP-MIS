import { UserRole } from "@prisma/client";
import type { DefaultSession, DefaultUser, User } from "next-auth";
import 'next-auth/jwt'
import { DefaultJWT } from "next-auth/jwt";

declare module 'next-auth' {
    interface Session {
        user: User & {
            id: string
            role: string
        } & DefaultSession
    }

    interface User extends DefaultUser {
        role: string
    }
}

declare module 'next-auth/jwt'{
    interface JWT extends DefaultJWT{
       role: string
    }
}