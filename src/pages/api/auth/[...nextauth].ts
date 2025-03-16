import NextAuth, { NextAuthOptions } from "next-auth"; 
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.username = session?.user.name?.replace(/[^a-zA-Z]/g, "").toLowerCase();          
            session.user.email = session?.user.email;
            session.user.name = session?.user.name;
            session.user.uid = token.sub;
            return session;
        }
    },
    secret: process.env.SECRET_KEY,
};

export default NextAuth(authOptions); 