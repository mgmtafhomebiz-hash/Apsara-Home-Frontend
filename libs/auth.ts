
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log('[Auth] Missing credentials')
                    return null
                }

                try {
                    const url = `${process.env.LARAVEL_API_URL}/api/auth/login`
                    console.log('[Auth] Calling:', url, 'email:', credentials.email)

                    const res = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    })

                    console.log('[Auth] Laravel response status:', res.status)

                    if (!res.ok) {
                        const errBody = await res.text()
                        console.log('[Auth] Laravel error body:', errBody)
                        return null
                    }

                    const data = await res.json()
                    console.log('[Auth] Laravel data keys:', Object.keys(data))

                    if (!data.user || !data.token) return null

                    return {
                        id: String(data.user.id),
                        name: data.user.name,
                        email: data.user.email,
                        accessToken: data.token,
                    }
                } catch (e) {
                    console.log('[Auth] Fetch error:', e)
                    return null
                }
            }
        })
    ],

    pages: {
        signIn: '/login',
    },

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.accessToken = (user as any).accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).accessToken = token.accessToken
            }
            return session
        }
    },

    secret: process.env.NEXTAUTH_SECRET
}