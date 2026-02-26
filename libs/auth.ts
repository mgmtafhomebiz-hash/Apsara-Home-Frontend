
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type TokenUser = {
    id?: string;
    accessToken?: string;
    role?: string;
    userLevelId?: number;
};

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
                        role: 'customer',
                    }
                } catch (e) {
                    console.log('[Auth] Fetch error:', e)
                    return null
                }
            }
        }),
        CredentialsProvider({
            id: 'admin-credentials',
            name: 'Admin Credentials',
            credentials: {
                login: { label: 'Email or Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.login || !credentials?.password) {
                    return null
                }

                try {
                    const url = `${process.env.LARAVEL_API_URL}/api/admin/auth/login`
                    const res = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            login: credentials.login,
                            password: credentials.password,
                        }),
                    })

                    if (!res.ok) {
                        const errBody = await res.text()
                        console.log('[AdminAuth] Laravel error body:', errBody)
                        return null
                    }

                    const data = await res.json()
                    if (!data.user || !data.token) return null

                    return {
                        id: String(data.user.id),
                        name: data.user.name ?? data.user.email,
                        email: data.user.email,
                        accessToken: data.token,
                        role: data.user.role,
                        userLevelId: data.user.user_level_id,
                    }
                } catch {
                    return null
                }
            }
        }),
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
                const authUser = user as TokenUser;
                token.id = authUser.id;
                token.accessToken = authUser.accessToken;
                token.role = authUser.role;
                token.userLevelId = authUser.userLevelId;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                const sessionUser = session.user as TokenUser;
                const authToken = token as TokenUser;
                sessionUser.id = authToken.id;
                sessionUser.accessToken = authToken.accessToken;
                sessionUser.role = authToken.role;
                sessionUser.userLevelId = authToken.userLevelId;
            }
            return session
        }
    },

    secret: process.env.NEXTAUTH_SECRET
}
