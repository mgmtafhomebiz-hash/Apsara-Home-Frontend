'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Loading from '@/components/Loading'
import { showErrorToast, showInfoToast, showSuccessToast } from '@/libs/toast'
import { clearAccessTokenCache } from "@/store/api/baseApi";
import PrimaryButton from '@/components/ui/buttons/PrimaryButton';

const REMEMBER_USER_EMAIL_KEY = 'afhome_user_login'
const BLOCKED_KEYWORDS = ['banned', 'blocked', 'contact support']

function resolveCallbackPath(value: string | null | undefined): string {
    const normalized = String(value ?? '').trim()
    if (!normalized.startsWith('/')) return '/shop'
    if (normalized.startsWith('//')) return '/shop'
    return normalized
}

function getRememberedUserEmail() {
    if (typeof window === 'undefined') return ''
    return window.localStorage.getItem(REMEMBER_USER_EMAIL_KEY) ?? ''
}

const EyeIcon = ({ open }: { open: boolean }) => open
    ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
    : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>

type FloatingInputProps = {
    id: string;
    type?: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    autoComplete?: string;
    endContent?: React.ReactNode;
}

function FloatingInput({ id, type = 'text', label, value, onChange, autoComplete, endContent }: FloatingInputProps) {
    const hasValue = value.trim().length > 0

    return (
        <div className="relative w-full">
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder=" "
                autoComplete={autoComplete}
                className="peer h-14 w-full rounded-[22px] border border-gray-300 dark:border-white/18 bg-white dark:bg-white/12 px-4 pb-3 pt-6 text-sm text-gray-900 dark:text-white outline-none transition-all duration-200 placeholder:text-transparent focus:border-orange-400 dark:focus:border-orange-400/60 focus:bg-white dark:focus:bg-white/18"
            />
            <label
                htmlFor={id}
                className={`pointer-events-none absolute left-4 origin-left bg-transparent px-1 text-gray-500 dark:text-white/55 transition-all duration-200 ${
                    hasValue
                        ? 'top-2 text-[11px] text-orange-500 dark:text-orange-300'
                        : 'top-1/2 -translate-y-1/2 text-sm'
                } peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-orange-500 dark:peer-focus:text-orange-300 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-orange-500 dark:peer-[:not(:placeholder-shown)]:text-orange-300 peer-autofill:top-2 peer-autofill:translate-y-0 peer-autofill:text-[11px] peer-autofill:text-orange-500 dark:peer-autofill:text-orange-300`}
            >
                {label}
            </label>
            {endContent ? (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/60">
                    {endContent}
                </div>
            ) : null}
        </div>
    )
}

interface LoginFormProps {
    onSwitchToSignUp: () => void;
    onRequirePasswordChange: () => void;
}

const LoginForm = ({ onSwitchToSignUp, onRequirePasswordChange }: LoginFormProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, update: updateSession } = useSession();
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        email: '',
        password: '',
        rememberMe: false,
    })

    const blockedFromRedirect = searchParams.get('blocked') === '1'
    const callbackPath = resolveCallbackPath(searchParams.get('callback') || searchParams.get('callbackUrl'))

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(f => ({ ...f, [field]: e.target.value }))

    useEffect(() => {
        const rememberedEmail = getRememberedUserEmail().trim()
        if (!rememberedEmail) return

        setForm((prev) => {
            if (prev.email || prev.password) return prev
            return {
                ...prev,
                email: rememberedEmail,
                rememberMe: true,
            }
        })
    }, [])



    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        clearAccessTokenCache()
        await signOut({ redirect: false })

        const result = await signIn('credentials', {
            email: form.email,
            password: form.password,
            redirect: false,
            callbackUrl: callbackPath,
        })

        setIsLoading(false)

        if (result?.ok) {
            if (typeof window !== 'undefined') {
                if (form.rememberMe) {
                    window.localStorage.setItem(REMEMBER_USER_EMAIL_KEY, form.email.trim())
                } else {
                    window.localStorage.removeItem(REMEMBER_USER_EMAIL_KEY)
                }
            }

            const session = await getSession()
            const passwordChangeRequired = Boolean(session?.user?.passwordChangeRequired)

            // Refresh session in all client components
            if (updateSession) {
                await updateSession()
            }

            if (passwordChangeRequired) {
                showInfoToast('Create a new password first before continuing to the shop.')
                onRequirePasswordChange()
                return
            }

            showSuccessToast('Login successful. Welcome back!')
            router.replace(callbackPath);
        } else {
            const rawError = String(result?.error ?? '').trim()
            const isBlockedError = BLOCKED_KEYWORDS.some((keyword) => rawError.toLowerCase().includes(keyword))
            const message = isBlockedError
                ? 'Your account has been banned. Please contact support for assistance.'
                : 'Invalid email or password. Please try again.'
            setError(message)
            showErrorToast(message)
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25 }}
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back!</h2>
            <p className="text-gray-500 dark:text-white/70 text-sm mb-7">Sign in to your AF Home account</p>

            <form className="space-y-4" onSubmit={handleSignIn}>
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 shadow-sm dark:border-red-400/20 dark:bg-red-500/20 dark:text-red-300">
                        {error}
                    </div>
                )}
                {!error && blockedFromRedirect && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 shadow-sm dark:border-red-400/20 dark:bg-red-500/20 dark:text-red-300">
                        Your account has been banned. Please contact support for assistance.
                    </div>
                )}
                <div>
                    <FloatingInput
                        id="login-email"
                        type="text"
                        label="Username or Email"
                        value={form.email}
                        onChange={set('email')}
                        autoComplete="username email"
                    />
                </div>

                <div className="">
                    <FloatingInput
                        id="login-password"
                        type={showPass ? 'text' : 'password'}
                        label="Password"
                        value={form.password}
                        onChange={set('password')}
                        autoComplete="current-password"
                        endContent={(
                            <button
                                type="button"
                                onClick={() => setShowPass(p => !p)}
                                className="text-gray-400 dark:text-white/60 hover:text-gray-700 dark:hover:text-white/80 transition-colors"
                            >
                                <EyeIcon open={showPass} />
                            </button>
                        )}
                    />
                    <p className="mt-1.5 text-[11px] text-gray-400 dark:text-white/55">Passwords are case-sensitive.</p>
                </div>

                <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 text-gray-500 dark:text-white/70 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.rememberMe}
                            onChange={(e) => setForm((prev) => ({ ...prev, rememberMe: e.target.checked }))}
                            className="h-4 w-4 rounded border-white/30 bg-white/10 accent-orange-500"
                        />
                        <span className="text-xs">Remember me</span>
                    </label>
                    <Link
                        href="/forgot-password"
                        className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                    >
                        Forgot Password
                    </Link>
                </div>

                <PrimaryButton
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? (
                        <>
                            <Loading size={14} />
                            <span>Signing in...</span>
                        </>
                    ) : (
                        <span>Sign in</span>
                    )}
                </PrimaryButton>
            </form>
        </motion.div>
    )
}

export default LoginForm
