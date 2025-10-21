import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { saveUserToDatabase } from "./lib/databaseFunc"
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [GitHub],
    callbacks: {
        async jwt({ token, user, account }) {
            console.log("{token, user, account}", { token, user, account })
            if (user) {
                console.log("🔐 初回ログイン")
                // token.userId = user.id
                token.userId = account?.providerAccountId

                await saveUserToDatabase({
                    // id: user.id,
                    id: account?.providerAccountId,
                    email: user.email,
                    name: user.name,
                    image: user.image
                })
            }
            return token
        },
        async session({ session, token }) {
            session.user.id = token.userId as string
            return session
        }
    }
})