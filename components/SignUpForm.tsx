'use client'

import { useState, type ChangeEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useRegisterMutation } from '@/store/api/authApi'
import Loading from './Loading'
import { useSearchParams } from 'next/navigation'
import { showErrorToast, showSuccessToast } from '@/libs/toast'
import OtpVerification from './auth/OtpVerification'
import { clearStoredReferralCode, getStoredReferralCode, normalizeReferralCode } from '@/libs/referral'
import PrimaryButton from '@/components/ui/buttons/PrimaryButton'

const EyeIcon = ({ open }: { open: boolean }) => open
  ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
  : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>

const labelClass = 'block text-xs font-semibold text-gray-600 dark:text-white/80 mb-1.5'
const inputClass = 'h-11 w-full rounded-[18px] border border-gray-300 dark:border-white/18 bg-white dark:bg-white/12 px-4 text-sm text-gray-900 dark:text-white outline-none transition-all duration-200 focus:border-sky-400 dark:focus:border-sky-400/60 focus:bg-white dark:focus:bg-white/18 disabled:cursor-not-allowed disabled:opacity-60'

type FloatingInputProps = {
  id: string
  type?: string
  label: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  disabled?: boolean
  maxLength?: number
  endContent?: ReactNode
}

function FloatingInput({ id, type = 'text', label, value, onChange, required, disabled, maxLength, endContent }: FloatingInputProps) {
  return (
    <div className="w-full">
      <label htmlFor={id} className={labelClass}>
        {label}{required ? <span className="text-red-500"> *</span> : null}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          className={inputClass}
        />
        {endContent ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/60">
            {endContent}
          </div>
        ) : null}
      </div>
    </div>
  )
}

const passwordChecks = (password: string) => ([
  { label: 'At least 8 characters', passed: password.length >= 8 },
  { label: 'At least one uppercase letter', passed: /[A-Z]/.test(password) },
  { label: 'At least one lowercase letter', passed: /[a-z]/.test(password) },
  { label: 'At least one number', passed: /[0-9]/.test(password) },
  { label: 'At least one special character', passed: /[^A-Za-z0-9]/.test(password) },
])

interface SignUpFormProps {
  onSwitchToLogin: () => void
}

export default function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const searchParams = useSearchParams()
  const [register, { isLoading }] = useRegisterMutation()
  const initialReferral = normalizeReferralCode(searchParams.get('ref') ?? searchParams.get('referred_by') ?? '') || getStoredReferralCode()

  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [verificationToken, setVerificationToken] = useState('')
  const [pendingEmail, setPendingEmail] = useState('')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    username: '',
    referredBy: initialReferral,
    password: '',
    confirmPassword: '',
  })

  const passwordRequirements = passwordChecks(form.password)

  const showError = (message: string): false => {
    setError(message)
    return false
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const firstName = form.firstName.trim()
    const lastName = form.lastName.trim()
    const mobileNumber = form.mobileNumber.trim()
    const email = form.email.trim()
    const username = form.username.trim()
    const referral = normalizeReferralCode(form.referredBy)

    if (!firstName) return showError('First name is required.')
    if (!lastName) return showError('Last name is required.')
    if (!mobileNumber) return showError('Mobile number is required.')
    if (!/^(\+?63|0)?9\d{9}$/.test(mobileNumber.replace(/\s+/g, ''))) return showError('Enter a valid Philippine mobile number.')
    if (!email) return showError('Email address is required.')
    if (!username) return showError('Username is required.')
    if (!/^[A-Za-z]+$/.test(username)) return showError('Username must contain letters only.')
    if (!referral) return showError('Referral code is required.')
    if (!form.password) return showError('Password is required.')
    if (form.password.length < 8) return showError('Password must be at least 8 characters.')
    if (form.password !== form.confirmPassword) return showError('Passwords do not match.')

    const result = await register({
      name: `${firstName} ${lastName}`.trim(),
      first_name: firstName,
      last_name: lastName,
      phone: mobileNumber,
      email,
      username,
      referred_by: referral,
      password: form.password,
      password_confirmation: form.confirmPassword,
    })

    if ('error' in result) {
      const errorData = (result.error as { data?: { errors?: Record<string, string[]>; message?: string } }).data
      const firstError = errorData?.errors
        ? Object.values(errorData.errors)[0]?.[0]
        : errorData?.message || 'Registration failed. Please try again.'
      showError(firstError)
      showErrorToast(firstError)
      return
    }

    setVerificationToken(result.data.verification_token)
    setPendingEmail(result.data.email || email)
    setStep('otp')
    showSuccessToast('A 4-digit verification code was sent to your email.')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Let&apos;s Get Started!</h2>
      <p className="text-gray-500 dark:text-white/70 text-sm mb-5">
        {step === 'otp'
          ? 'Enter the 4-digit code we sent to your email to finish your registration.'
          : 'Please enter the required details to create your account.'}
      </p>

      {step === 'otp' ? (
        <OtpVerification
          email={pendingEmail}
          verificationToken={verificationToken}
          onSuccess={() => {
            if (typeof window !== 'undefined') {
              window.localStorage.setItem('afhome_new_registration_email', pendingEmail)
            }
            clearStoredReferralCode()
            setStep('form')
            setVerificationToken('')
            setPendingEmail('')
            onSwitchToLogin()
          }}
          onBack={() => {
            setStep('form')
            setVerificationToken('')
            setPendingEmail('')
          }}
        />
      ) : (
        <form onSubmit={handleRegister} noValidate className="space-y-4">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 shadow-sm dark:border-red-400/20 dark:bg-red-500/20 dark:text-red-300">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FloatingInput id="signup-first-name" label="First Name" required value={form.firstName} onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))} />
            <FloatingInput id="signup-last-name" label="Last Name" required value={form.lastName} onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))} />
          </div>

          <FloatingInput
            id="signup-mobile-number"
            type="tel"
            label="Mobile Number"
            required
            value={form.mobileNumber}
            onChange={(e) => setForm((prev) => ({ ...prev, mobileNumber: e.target.value.replace(/[^\d+\s()-]/g, '') }))}
          />
          <p className="text-[11px] text-gray-500 dark:text-white/55 -mt-2">Use your Philippine mobile number, for example +63 912 345 6789.</p>

          <FloatingInput id="signup-email" type="email" label="Email Address" required value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />

          <FloatingInput
            id="signup-username"
            label="Username"
            required
            value={form.username}
            onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value.replace(/\s+/g, '') }))}
          />
          <p className="text-[11px] text-gray-500 dark:text-white/55 -mt-2">Letters only, no spaces or symbols.</p>

          <FloatingInput
            id="signup-referred-by"
            label="Referral Code"
            value={form.referredBy}
            onChange={(e) => setForm((prev) => ({ ...prev, referredBy: e.target.value }))}
            required
          />

          <div>
            <FloatingInput
              type={showPass ? 'text' : 'password'}
              id="signup-password"
              label="Password"
              required
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              endContent={(
                <button type="button" onClick={() => setShowPass((p) => !p)} className="text-gray-400 dark:text-white/60 hover:text-gray-700 dark:hover:text-white/80 transition-colors cursor-pointer">
                  <EyeIcon open={showPass} />
                </button>
              )}
            />
            <div className="mt-2 grid grid-cols-1 gap-1 pt-1">
              {passwordRequirements.map((item) => (
                <p key={item.label} className={`text-[11px] flex items-center gap-2 ${item.passed ? 'text-emerald-600 dark:text-emerald-300' : 'text-gray-400 dark:text-white/55'}`}>
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${item.passed ? 'bg-emerald-400' : 'bg-gray-300 dark:bg-white/25'}`} />
                  {item.label}
                </p>
              ))}
            </div>
          </div>

          <FloatingInput
            type={showConfirm ? 'text' : 'password'}
            id="signup-confirm-password"
            label="Password Confirmation"
            required
            value={form.confirmPassword}
            onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            endContent={(
              <button type="button" onClick={() => setShowConfirm((p) => !p)} className="text-gray-400 dark:text-white/60 hover:text-gray-700 dark:hover:text-white/80 transition-colors cursor-pointer">
                <EyeIcon open={showConfirm} />
              </button>
            )}
          />

          <div className="flex gap-3 pt-2">
            <PrimaryButton type="submit" disabled={isLoading} className="flex-1 py-3 px-5 text-sm">
              {isLoading ? (
                <>
                  <Loading size={14} />
                  <span>SENDING OTP...</span>
                </>
              ) : (
                <span>SIGN UP</span>
              )}
            </PrimaryButton>
          </div>
        </form>
      )}
    </motion.div>
  )
}
