import NextAuth from "next-auth"
import type { NextAuthOptions } from 'next-auth'
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"
import GithubProvider from "next-auth/providers/github"

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        async session({ session, user }) {
            if (session?.user) {
                session.user.id = user.id;
              }
              return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions);