'use client'

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLazyCheckEmailAvailabilityQuery, useLazyCheckUsernameAvailabilityQuery, useRegisterMutation } from '@/store/api/authApi'
import Loading from './Loading'
import { usePhAddress } from '@/hooks/usePhAddress'
import { useSearchParams } from 'next/navigation'
import { showErrorToast, showSuccessToast } from '@/libs/toast'
import OtpVerification from './auth/OtpVerification'
import { clearStoredReferralCode, getStoredReferralCode, normalizeReferralCode } from '@/libs/referral'
import { containsBlockedWord } from '@/libs/badWords'
import { Calendar, DateField, DatePicker, Label, ListBox, ListBoxItem, Select } from '@heroui/react'
import { parseDate } from '@internationalized/date'
import PrimaryButton from '@/components/ui/buttons/PrimaryButton'
import SecondaryButton from '@/components/ui/buttons/SecondaryButton'

const EyeIcon = ({ open }: { open: boolean }) => open
    ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
    : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>

const labelClass = "block text-xs font-semibold text-gray-600 dark:text-white/80 mb-1.5"
const inputClass = "h-14 w-full rounded-[22px] border border-gray-300 dark:border-white/18 bg-white dark:bg-white/12 px-4 text-sm text-gray-900 dark:text-white outline-none transition-all duration-200 focus:border-orange-400 dark:focus:border-orange-400/60 focus:bg-white dark:focus:bg-white/18 disabled:cursor-not-allowed disabled:opacity-60"
const nativeSelectClass = "h-14 w-full appearance-none rounded-[22px] border border-gray-300 dark:border-white/18 bg-white dark:bg-white/12 px-4 pr-11 text-sm text-gray-900 dark:text-white outline-none transition-all duration-200 focus:border-orange-400 dark:focus:border-orange-400/60 focus:bg-white dark:focus:bg-white/18 disabled:cursor-not-allowed disabled:opacity-60"

type FloatingInputProps = {
    id: string;
    type?: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    disabled?: boolean;
    maxLength?: number;
    endContent?: React.ReactNode;
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
            {endContent && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/60">
                    {endContent}
                </div>
            )}
            </div>
        </div>
    )
}

type NativeSelectOption = {
    value: string;
    label: string;
}

type NativeSelectFieldProps = {
    label: React.ReactNode;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    options: NativeSelectOption[];
    isDisabled?: boolean;
    isLoading?: boolean;
}

type HeroSelectFieldProps = {
    label: React.ReactNode;
    placeholder: string;
    selectedKey: string;
    selectedLabel?: string;
    onSelectionChange: (key: string | null) => void;
    isDisabled?: boolean;
    isLoading?: boolean;
    children: React.ReactNode;
}

function HeroSelectField({ label, placeholder, selectedKey, selectedLabel, onSelectionChange, isDisabled, isLoading, children }: HeroSelectFieldProps) {
    return (
        <div>
            <label className={labelClass}>{label}</label>
            <Select
                aria-label={typeof label === 'string' ? label : 'Select field'}
                selectedKey={selectedKey || null}
                onSelectionChange={(key) => onSelectionChange(key ? String(key) : null)}
                isDisabled={isDisabled || isLoading}
                className="w-full"
            >
                <Select.Trigger className="flex h-14 w-full items-center justify-between rounded-[22px] border border-gray-300 dark:border-white/18 bg-white dark:bg-white/12 px-4 text-left text-sm text-gray-900 dark:text-white transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/16 focus:border-orange-400 dark:focus:border-orange-400/60 focus:bg-white dark:focus:bg-white/18 disabled:cursor-not-allowed disabled:opacity-60">
                    <span className={selectedKey ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-white/45'}>
                        {isLoading ? 'Loading...' : (selectedLabel || placeholder)}
                    </span>
                    {isLoading
                        ? <Loading size={16} />
                        : <Select.Indicator className="h-4 w-4 text-gray-400 dark:text-white/55" />
                    }
                </Select.Trigger>
                <Select.Popover className="min-w-[var(--trigger-width)]">
                    <ListBox className="p-1">{children}</ListBox>
                </Select.Popover>
            </Select>
        </div>
    )
}

function NativeSelectField({ label, placeholder, value, onChange, options, isDisabled, isLoading }: NativeSelectFieldProps) {
    return (
        <div>
            <label className={labelClass}>{label}</label>
            <div className="relative">
                <select
                    aria-label={typeof label === 'string' ? label : 'Select field'}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    disabled={isDisabled || isLoading}
                    className={nativeSelectClass}
                >
                    <option value="">{isLoading ? 'Loading...' : placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400 dark:text-white/55">
                    {isLoading ? (
                        <Loading size={16} />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    )}
                </div>
            </div>
        </div>
    )
}

const getPasswordStrength = (password: string) => {
    let score = 0
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    if (password.length >= 12) score += 1

    if (password.length === 0) return { score: 0, label: 'Enter a password', color: 'bg-gray-200 dark:bg-white/10', textColor: 'text-gray-400 dark:text-white/50', width: '0%' }
    if (score <= 2) return { score, label: 'Weak password', color: 'bg-red-400', textColor: 'text-red-500 dark:text-red-300', width: '33%' }
    if (score <= 4) return { score, label: 'Medium strength', color: 'bg-yellow-400', textColor: 'text-yellow-600 dark:text-yellow-300', width: '66%' }
    return { score, label: 'Strong password', color: 'bg-emerald-400', textColor: 'text-emerald-600 dark:text-emerald-300', width: '100%' }
}

const passwordChecks = (password: string) => ([
    { label: 'At least 8 characters', passed: password.length >= 8 },
    { label: 'At least one uppercase letter', passed: /[A-Z]/.test(password) },
    { label: 'At least one lowercase letter', passed: /[a-z]/.test(password) },
    { label: 'At least one number', passed: /[0-9]/.test(password) },
    { label: 'At least one special character', passed: /[^A-Za-z0-9]/.test(password) },
])

const normalizePhoneDigits = (value: string) => {
    const digits = value.replace(/\D/g, '')
    const trimmed = digits.startsWith('0') ? digits.slice(1) : digits
    return trimmed.slice(0, 10)
}

const formatPhoneNumber = (value: string) => {
    const digits = normalizePhoneDigits(value)
    const first = digits.slice(0, 3)
    const second = digits.slice(3, 6)
    const third = digits.slice(6, 10)

    return [first, second, third].filter(Boolean).join('-')
}

const isEmailLikeUsername = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return false
    return trimmed.includes('@')
}

type FormPage = 1 | 2 | 3
const stepLabels: [string, string, string] = ['Personal', 'Address', 'Security']

interface SignUpFormProps {
    onSwitchToLogin: () => void
}

export default function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
    const searchParams = useSearchParams()
    const [register, { isLoading }] = useRegisterMutation()
    const [checkEmailAvailability, { isFetching: isCheckingEmail }] = useLazyCheckEmailAvailabilityQuery()
    const [checkUsernameAvailability, { isFetching: isCheckingUsername }] = useLazyCheckUsernameAvailabilityQuery()
    const initialReferral = normalizeReferralCode(searchParams.get('ref') ?? searchParams.get('referred_by') ?? '') || getStoredReferralCode()

    const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [preferNativeDateInput, setPreferNativeDateInput] = useState(() => {
        if (typeof window === 'undefined') return false

        const hasCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false
        const hasTouchSupport = navigator.maxTouchPoints > 0
        const isAppleTouchDevice = /iPhone|iPad|iPod/i.test(navigator.userAgent)

        return hasCoarsePointer || hasTouchSupport || isAppleTouchDevice
    })
    const [error, setError] = useState('')
    const [showStep3Error, setShowStep3Error] = useState(false)
    const [step, setStep] = useState<'form' | 'otp'>('form')
    const [formPage, setFormPage] = useState<FormPage>(1)
    const [verificationToken, setVerificationToken] = useState('')
    const [pendingEmail, setPendingEmail] = useState('')
    const errorRef = useRef<HTMLDivElement | null>(null)
    const stepTopRef = useRef<HTMLDivElement | null>(null)
    const nativeBirthDateInputRef = useRef<HTMLInputElement | null>(null)
    const heroDateFallbackTimerRef = useRef<number | null>(null)

    const ph = usePhAddress({ legacyNoProvinceRegions: true, source: 'auto' })

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        gender: '',
        occupation: '',
        workLocation: 'local',
        country: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        username: '',
        referredBy: initialReferral,
        birthDate: '',
        address: '',
        zipCode: '',
        agreeTerms: false,
    })

    const passwordStrength = getPasswordStrength(form.password)
    const passwordRequirements = passwordChecks(form.password)
    const [usernameAvailabilityMessage, setUsernameAvailabilityMessage] = useState('')
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null)
    const [emailAvailabilityMessage, setEmailAvailabilityMessage] = useState('')
    const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null)
    const isUsernameEmailLike = isEmailLikeUsername(form.username)
    const normalizedEmail = form.email.trim().toLowerCase()
    const isEmailFormatValid = normalizedEmail.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    const usernameFieldError = isUsernameEmailLike
        ? 'Username must not be an email address. Remove @gmail.com, @yahoo.com, or any email format.'
        : isUsernameAvailable === false
            ? (usernameAvailabilityMessage || 'This username is already taken.')
            : ''
    const emailFieldError = normalizedEmail && !isEmailFormatValid
        ? 'Enter a valid email address.'
        : isEmailAvailable === false
            ? (emailAvailabilityMessage || 'This email is already registered.')
            : ''
    const birthDateValue = (() => {
        if (!form.birthDate) return null
        try { return parseDate(form.birthDate) } catch { return null }
    })()

    const clearHeroDateFallbackTimer = () => {
        if (heroDateFallbackTimerRef.current !== null) {
            window.clearTimeout(heroDateFallbackTimerRef.current)
            heroDateFallbackTimerRef.current = null
        }
    }

    const activateNativeDateFallback = () => {
        clearHeroDateFallbackTimer()
        setPreferNativeDateInput(true)

        window.requestAnimationFrame(() => {
            nativeBirthDateInputRef.current?.focus()
            nativeBirthDateInputRef.current?.showPicker?.()
        })
    }

    const queueHeroDateFallback = () => {
        if (preferNativeDateInput) return

        clearHeroDateFallbackTimer()
        heroDateFallbackTimerRef.current = window.setTimeout(() => {
            activateNativeDateFallback()
        }, 325)
    }

    useEffect(() => {
        return () => {
            clearHeroDateFallbackTimer()
        }
    }, [])

    useLayoutEffect(() => {
        if (step !== 'form' || formPage !== 3) return

        const frame = window.requestAnimationFrame(() => {
            setShowStep3Error(false)
            setError('')
        })

        return () => window.cancelAnimationFrame(frame)
    }, [step, formPage])

    useEffect(() => {
        const email = normalizedEmail

        if (!email) {
            const frame = window.requestAnimationFrame(() => {
                setEmailAvailabilityMessage('')
                setIsEmailAvailable(null)
            })

            return () => window.cancelAnimationFrame(frame)
        }

        if (!isEmailFormatValid) {
            const frame = window.requestAnimationFrame(() => {
                setEmailAvailabilityMessage('Enter a valid email address.')
                setIsEmailAvailable(null)
            })

            return () => window.cancelAnimationFrame(frame)
        }

        const timer = window.setTimeout(async () => {
            try {
                const response = await checkEmailAvailability(email).unwrap()
                setIsEmailAvailable(response.available)
                setEmailAvailabilityMessage(response.message)
            } catch {
                setIsEmailAvailable(null)
                setEmailAvailabilityMessage('Unable to check email right now.')
            }
        }, 450)

        return () => window.clearTimeout(timer)
    }, [checkEmailAvailability, isEmailFormatValid, normalizedEmail])

    useEffect(() => {
        const username = form.username.trim()

        if (!username) {
            const frame = window.requestAnimationFrame(() => {
                setUsernameAvailabilityMessage('')
                setIsUsernameAvailable(null)
            })

            return () => window.cancelAnimationFrame(frame)
        }

        if (isEmailLikeUsername(username)) {
            const frame = window.requestAnimationFrame(() => {
                setUsernameAvailabilityMessage('Username must not be an email address.')
                setIsUsernameAvailable(false)
            })

            return () => window.cancelAnimationFrame(frame)
        }

        if (username.length < 3) {
            const frame = window.requestAnimationFrame(() => {
                setUsernameAvailabilityMessage('Username must be at least 3 characters.')
                setIsUsernameAvailable(null)
            })

            return () => window.cancelAnimationFrame(frame)
        }

        const timer = window.setTimeout(async () => {
            try {
                const response = await checkUsernameAvailability(username).unwrap()
                setIsUsernameAvailable(response.available)
                setUsernameAvailabilityMessage(response.message)
            } catch {
                setIsUsernameAvailable(null)
                setUsernameAvailabilityMessage('Unable to check username right now.')
            }
        }, 450)

        return () => window.clearTimeout(timer)
    }, [checkUsernameAvailability, form.username])

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value)
        setForm((prev) => ({ ...prev, phone: formatted }))
    }

    const showError = (message: string): false => {
        setError(message)
        requestAnimationFrame(() => {
            errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
        return false
    }

    const showStep3ValidationError = (message: string): false => {
        setShowStep3Error(true)
        return showError(message)
    }

    const scrollStepToTop = () => {
        requestAnimationFrame(() => {
            stepTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
    }

    const resetOtpStep = () => {
        setStep('form')
        setVerificationToken('')
        setPendingEmail('')
        setShowStep3Error(false)
    }

    const validateStep1 = (): boolean => {
        if (!form.firstName.trim()) return showError('First name is required.')
        if (!form.lastName.trim()) return showError('Last name is required.')
        if (!form.birthDate) return showError('Birth date is required.')
        if (!form.email.trim()) return showError('Email address is required.')
        if (!isEmailFormatValid) return showError('Enter a valid email address.')
        if (isEmailAvailable === false) return showError(emailAvailabilityMessage || 'This email is already registered.')
        if (!form.gender) return showError('Gender is required.')
        if (!form.occupation.trim()) return showError('Occupation is required.')
        if (!form.phone.trim()) return showError('Phone number is required.')
        if (!form.username.trim()) return showError('Username is required.')
        if (form.username.trim().length < 3) return showError('Username must be at least 3 characters.')
        if (isEmailLikeUsername(form.username)) return showError('Username must not be an email address. Please remove @gmail.com, @yahoo.com, and similar email formats.')
        if (isUsernameAvailable === false) return showError(usernameAvailabilityMessage || 'This username is already taken.')
        if (!form.referredBy.trim()) return showError('Referral code is required.')
        return true
    }

    const validateStep2 = (): boolean => {
        if (!form.address.trim()) return showError('Street / House No. is required.')
        if (!ph.regionCode) return showError('Region is required.')
        if (!ph.cityCode) return showError('City / Municipality is required.')
        if (!ph.address.barangay) return showError('Barangay is required.')
        if (!form.zipCode.trim()) return showError('ZIP code is required.')
        return true
    }

    const handleNext = () => {
        setError('')
        setShowStep3Error(false)
        if (formPage === 1 && validateStep1()) { setFormPage(2); scrollStepToTop() }
        else if (formPage === 2 && validateStep2()) {
            setError('')
            setShowStep3Error(false)
            setFormPage(3)
            scrollStepToTop()
        }
    }

    const handleBack = () => {
        setError('')
        setShowStep3Error(false)
        setFormPage(p => (p - 1) as FormPage)
        scrollStepToTop()
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!form.agreeTerms) return showStep3ValidationError('You must agree to the Terms & Conditions.')
        if (form.username.trim().length < 3) return showStep3ValidationError('Username must be at least 3 characters.')
        if (isEmailLikeUsername(form.username)) return showStep3ValidationError('Username must not be an email address. Please remove @gmail.com, @yahoo.com, and similar email formats.')
        if (isUsernameAvailable === false) return showStep3ValidationError(usernameAvailabilityMessage || 'This username is already taken.')
        if (form.password !== form.confirmPassword) return showStep3ValidationError('Passwords do not match.')
        if (form.password.length < 8) return showStep3ValidationError('Password must be at least 8 characters.')
        if (!/[A-Z]/.test(form.password)) return showStep3ValidationError('Password must include at least one uppercase letter.')
        if (!/[a-z]/.test(form.password)) return showStep3ValidationError('Password must include at least one lowercase letter.')
        if (!/[0-9]/.test(form.password)) return showStep3ValidationError('Password must include at least one number.')
        if (!/[^A-Za-z0-9]/.test(form.password)) return showStep3ValidationError('Password must include at least one special character.')
        if (containsBlockedWord(form.firstName) || containsBlockedWord(form.lastName) || containsBlockedWord(form.username) || containsBlockedWord(form.middleName)) {
            return showStep3ValidationError('Account details contain prohibited words. Please use appropriate name/username.')
        }

        const result = await register({
            name: `${form.firstName} ${form.lastName}`,
            first_name: form.firstName,
            last_name: form.lastName,
            middle_name: form.middleName,
            email: form.email,
            password: form.password,
            password_confirmation: form.confirmPassword,
            phone: normalizePhoneDigits(form.phone),
            username: form.username,
            referred_by: normalizeReferralCode(form.referredBy),
            birth_date: form.birthDate,
            gender: form.gender === '' ? undefined : (form.gender as 'male' | 'female' | 'other'),
            occupation: form.occupation,
            work_location: form.workLocation as 'local' | 'overseas',
            country: form.workLocation === 'overseas' ? form.country : 'Philippines',
            address: form.address,
            barangay: ph.address.barangay,
            barangay_code: ph.barangays.find((barangay) => barangay.name === ph.address.barangay)?.code ?? '',
            city: ph.address.city,
            city_code: ph.cityCode,
            province: ph.address.province,
            province_code: ph.provinceCode,
            region: ph.address.region,
            region_code: ph.regionCode,
            zip_code: form.zipCode,
        })

        if ('error' in result) {
            const errorData = (result.error as { data?: { errors?: Record<string, string[]>; message?: string } }).data
            const firstError = errorData?.errors
                ? Object.values(errorData.errors)[0][0]
                : errorData?.message || 'Registration failed. Please try again.'
            setShowStep3Error(true)
            showError(firstError)
            showErrorToast(firstError)
            return
        }

        setVerificationToken(result.data.verification_token)
        setPendingEmail(result.data.email || form.email)
        setStep('otp')
        setError('')
        setShowStep3Error(false)
        showSuccessToast('A 4-digit verification code was sent to your email.')
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        if (formPage < 3) {
            e.preventDefault()
            handleNext()
            return
        }

        void handleRegister(e)
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
                    : 'Please enter your details to start your online application'}
            </p>

            {step === 'otp' ? (
                <OtpVerification
                    email={pendingEmail}
                    verificationToken={verificationToken}
                    onSuccess={() => {
                        clearStoredReferralCode()
                        resetOtpStep()
                        onSwitchToLogin()
                    }}
                    onBack={resetOtpStep}
                />
            ) : (
                <form onSubmit={handleFormSubmit} noValidate className="space-y-4">

                    {/* Step Indicator */}
                    <div ref={stepTopRef}>
                        <div className="flex items-center">
                            {([1, 2, 3] as FormPage[]).map((s, i) => (
                                <Fragment key={s}>
                                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                        s < formPage
                                            ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300'
                                            : s === formPage
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-white/40'
                                    }`}>
                                        {s < formPage ? '✓' : s}
                                    </div>
                                    {i < 2 && (
                                        <div className={`flex-1 h-px mx-1 transition-colors ${
                                            s < formPage ? 'bg-orange-400' : 'bg-gray-200 dark:bg-white/10'
                                        }`} />
                                    )}
                                </Fragment>
                            ))}
                        </div>
                        <div className="flex justify-between mt-1.5 mb-2">
                            {stepLabels.map((label, i) => (
                                <span key={label} className={`text-[10px] font-semibold ${
                                    i + 1 === formPage
                                        ? 'text-orange-500 dark:text-orange-400'
                                        : i + 1 < formPage
                                            ? 'text-orange-400/70 dark:text-orange-300/70'
                                            : 'text-gray-400 dark:text-white/30'
                                }`}>
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (formPage !== 3 || showStep3Error) && (
                        <div ref={errorRef} className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 shadow-sm dark:border-red-400/20 dark:bg-red-500/20 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={formPage}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-4"
                        >

                            {/* ── STEP 1: Personal Information ── */}
                            {formPage === 1 && (
                                <>
                                    <div className="space-y-1 pb-1">
                                        <p className="text-xs font-bold text-orange-500 dark:text-orange-400 uppercase tracking-widest">Personal Information</p>
                                        <div className="h-px bg-gray-200 dark:bg-white/10" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <FloatingInput id="signup-first-name" label="First Name" required
                                            value={form.firstName} onChange={set('firstName')} />
                                        <FloatingInput id="signup-last-name" label="Last Name" required
                                            value={form.lastName} onChange={set('lastName')} />
                                    </div>

                                    <FloatingInput id="signup-middle-name" label="Middle Name"
                                        value={form.middleName} onChange={set('middleName')} />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>Birth Date <span className="text-red-500">*</span></label>
                                            {preferNativeDateInput ? (
                                                <input
                                                    id="signup-birth-date"
                                                    ref={nativeBirthDateInputRef}
                                                    type="date"
                                                    name="birthDate"
                                                    value={form.birthDate}
                                                    onChange={(e) => setForm((prev) => ({ ...prev, birthDate: e.target.value }))}
                                                    max={new Date().toISOString().split('T')[0]}
                                                    required
                                                    className={inputClass}
                                                />
                                            ) : (
                                                <div onPointerDownCapture={queueHeroDateFallback}>
                                                    <DatePicker
                                                        className="w-full"
                                                        aria-label="Birth Date"
                                                        name="birthDate"
                                                        value={birthDateValue ?? undefined}
                                                        onChange={(value) => setForm((prev) => ({ ...prev, birthDate: value ? value.toString() : '' }))}
                                                        onOpenChange={(isOpen) => {
                                                            if (isOpen) {
                                                                clearHeroDateFallbackTimer()
                                                            }
                                                        }}
                                                    >
                                                        <Label className="sr-only">Birth Date</Label>
                                                        <DateField.Group
                                                            fullWidth
                                                            className="flex h-14 w-full items-center rounded-[22px] border border-gray-300 dark:border-white/18 bg-white dark:bg-white/12 px-4 text-sm text-gray-900 dark:text-white transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/16 focus-within:border-orange-400 dark:focus-within:border-orange-400/60"
                                                        >
                                                            <DateField.Input className="flex-1 text-sm text-gray-900 dark:text-white data-[placeholder=true]:text-gray-400 dark:data-[placeholder=true]:text-white/45">
                                                                {(segment) => (
                                                                    <DateField.Segment
                                                                        segment={segment}
                                                                        className="rounded-md px-0.5 outline-none transition data-[placeholder=true]:text-gray-400 dark:data-[placeholder=true]:text-white/45 data-[focused=true]:bg-orange-500/15 data-[focused=true]:text-orange-600 dark:data-[focused=true]:text-orange-200"
                                                                    />
                                                                )}
                                                            </DateField.Input>
                                                            <DateField.Suffix className="ml-3 flex items-center">
                                                                <DatePicker.Trigger className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/60 transition hover:bg-gray-200 dark:hover:bg-white/16 hover:text-gray-800 dark:hover:text-white focus:outline-none cursor-pointer">
                                                                    <DatePicker.TriggerIndicator />
                                                                </DatePicker.Trigger>
                                                            </DateField.Suffix>
                                                        </DateField.Group>
                                                        <DatePicker.Popover className="border-0 bg-transparent p-0 shadow-none">
                                                            <Calendar className="min-w-[340px] rounded-[24px] border border-slate-200 bg-white p-4 text-slate-800 shadow-[0_24px_80px_rgba(15,23,42,0.16)] dark:border-white/10 dark:bg-slate-900 dark:text-slate-100">
                                                                <Calendar.Header className="mb-3 flex items-center justify-between gap-3">
                                                                    <Calendar.YearPickerTrigger className="inline-flex min-w-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10">
                                                                        <Calendar.YearPickerTriggerHeading />
                                                                        <Calendar.YearPickerTriggerIndicator className="text-slate-500 dark:text-slate-400" />
                                                                    </Calendar.YearPickerTrigger>
                                                                    <div className="ml-auto flex items-center gap-2 pl-2">
                                                                        <Calendar.NavButton slot="previous" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-orange-400/30 dark:hover:bg-orange-500/10 dark:hover:text-orange-300" />
                                                                        <Calendar.NavButton slot="next" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-orange-400/30 dark:hover:bg-orange-500/10 dark:hover:text-orange-300" />
                                                                    </div>
                                                                </Calendar.Header>
                                                                <Calendar.Grid className="w-full">
                                                                    <Calendar.GridHeader>
                                                                        {(day) => (
                                                                            <Calendar.HeaderCell className="pb-2 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                                                                                {day}
                                                                            </Calendar.HeaderCell>
                                                                        )}
                                                                    </Calendar.GridHeader>
                                                                    <Calendar.GridBody>
                                                                        {(date) => (
                                                                            <Calendar.Cell
                                                                                date={date}
                                                                                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-slate-700 transition hover:bg-orange-100 hover:text-orange-600 data-[focused=true]:bg-orange-100 data-[focused=true]:text-orange-600 data-[selected=true]:bg-orange-500 data-[selected=true]:text-white data-[outside-month=true]:text-slate-300 dark:text-slate-200 dark:hover:bg-orange-500/15 dark:hover:text-orange-300 dark:data-[focused=true]:bg-orange-500/15 dark:data-[focused=true]:text-orange-300 dark:data-[outside-month=true]:text-slate-600"
                                                                            />
                                                                        )}
                                                                    </Calendar.GridBody>
                                                                </Calendar.Grid>
                                                                <Calendar.YearPickerGrid className="mt-2">
                                                                    <Calendar.YearPickerGridBody>
                                                                        {({ year }) => (
                                                                            <Calendar.YearPickerCell
                                                                                year={year}
                                                                                className="flex h-10 items-center justify-center rounded-xl text-sm font-medium text-slate-700 transition hover:bg-orange-100 hover:text-orange-600 data-[selected=true]:bg-orange-500 data-[selected=true]:text-white dark:text-slate-200 dark:hover:bg-orange-500/15 dark:hover:text-orange-300"
                                                                            />
                                                                        )}
                                                                    </Calendar.YearPickerGridBody>
                                                                </Calendar.YearPickerGrid>
                                                            </Calendar>
                                                        </DatePicker.Popover>
                                                    </DatePicker>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <FloatingInput id="signup-email" type="email" label="Email Address" required
                                                value={form.email} onChange={set('email')} />
                                            {emailFieldError ? (
                                                <p className="mt-1.5 text-xs font-medium text-red-500 dark:text-red-300">
                                                    {emailFieldError}
                                                </p>
                                            ) : isCheckingEmail && isEmailFormatValid ? (
                                                <p className="mt-1.5 text-xs font-medium text-amber-500 dark:text-amber-300">
                                                    Checking email availability...
                                                </p>
                                            ) : isEmailAvailable === true ? (
                                                <p className="mt-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                                                    {emailAvailabilityMessage || 'Email address is available.'}
                                                </p>
                                            ) : normalizedEmail ? (
                                                <p className="mt-1.5 text-xs text-gray-500 dark:text-white/55">
                                                    This email will be used for OTP verification and sign in.
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <div className="sm:hidden">
                                                <NativeSelectField
                                                    label={<>Gender <span className="text-red-500">*</span></>}
                                                    placeholder="Select Gender"
                                                    value={form.gender}
                                                    onChange={(value) => setForm((prev) => ({ ...prev, gender: value }))}
                                                    options={[
                                                        { value: 'male', label: 'Male' },
                                                        { value: 'female', label: 'Female' },
                                                        { value: 'other', label: 'Other' },
                                                    ]}
                                                />
                                            </div>
                                            <div className="hidden sm:block">
                                                <HeroSelectField
                                                    label={<>Gender <span className="text-red-500">*</span></>}
                                                    placeholder="Select Gender"
                                                    selectedKey={form.gender}
                                                    selectedLabel={form.gender ? form.gender.charAt(0).toUpperCase() + form.gender.slice(1) : ''}
                                                    onSelectionChange={(key) => setForm((prev) => ({ ...prev, gender: key ? String(key) : '' }))}
                                                >
                                                    <ListBoxItem id="male">Male</ListBoxItem>
                                                    <ListBoxItem id="female">Female</ListBoxItem>
                                                    <ListBoxItem id="other">Other</ListBoxItem>
                                                </HeroSelectField>
                                            </div>
                                        </div>
                                        <FloatingInput id="signup-occupation" label="Occupation" required
                                            value={form.occupation} onChange={set('occupation')} />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <div className="sm:hidden">
                                                <NativeSelectField
                                                    label="Work Location"
                                                    placeholder="Select work location"
                                                    value={form.workLocation}
                                                    onChange={(value) => setForm((prev) => ({ ...prev, workLocation: value || 'local' }))}
                                                    options={[
                                                        { value: 'local', label: 'Local (Philippines)' },
                                                        { value: 'overseas', label: 'Overseas' },
                                                    ]}
                                                />
                                            </div>
                                            <div className="hidden sm:block">
                                                <HeroSelectField
                                                    label="Work Location"
                                                    placeholder="Select work location"
                                                    selectedKey={form.workLocation}
                                                    selectedLabel={form.workLocation === 'overseas' ? 'Overseas' : 'Local (Philippines)'}
                                                    onSelectionChange={(key) => setForm((prev) => ({ ...prev, workLocation: key ? String(key) : 'local' }))}
                                                >
                                                    <ListBoxItem id="local">Local (Philippines)</ListBoxItem>
                                                    <ListBoxItem id="overseas">Overseas</ListBoxItem>
                                                </HeroSelectField>
                                            </div>
                                        </div>
                                        <FloatingInput
                                            id="signup-country"
                                            label="Country"
                                            value={form.workLocation === 'overseas' ? form.country : 'Philippines'}
                                            onChange={set('country')}
                                            disabled={form.workLocation !== 'overseas'}
                                            required={form.workLocation === 'overseas'}
                                        />
                                    </div>

                                    <div className="w-full">
                                        <label htmlFor="signup-phone" className={labelClass}>
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <div className="flex h-14 shrink-0 items-center justify-center rounded-[22px] border border-gray-300 dark:border-white/18 bg-white dark:bg-white/12 px-4 text-sm font-semibold text-gray-600 dark:text-white/80">
                                                +63
                                            </div>
                                            <input
                                                id="signup-phone"
                                                type="tel"
                                                value={form.phone}
                                                onChange={handlePhoneChange}
                                                inputMode="numeric"
                                                pattern="[0-9-]*"
                                                maxLength={12}
                                                autoComplete="tel-national"
                                                placeholder="929-226-0447"
                                                required
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <FloatingInput id="signup-username" label="Username" required
                                                value={form.username}
                                                onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value.replace(/\s+/g, '') }))}
                                            />
                                            {usernameFieldError ? (
                                                <p className="mt-1.5 text-xs font-medium text-red-500 dark:text-red-300">
                                                    {usernameFieldError}
                                                </p>
                                            ) : isCheckingUsername && form.username.trim().length >= 3 ? (
                                                <p className="mt-1.5 text-xs font-medium text-amber-500 dark:text-amber-300">
                                                    Checking username availability...
                                                </p>
                                            ) : isUsernameAvailable === true ? (
                                                <p className="mt-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                                                    {usernameAvailabilityMessage || 'Username is available.'}
                                                </p>
                                            ) : form.username.trim().length > 0 && form.username.trim().length < 3 ? (
                                                <p className="mt-1.5 text-xs font-medium text-amber-500 dark:text-amber-300">
                                                    Username must be at least 3 characters.
                                                </p>
                                            ) : form.username.trim() ? (
                                                <p className="mt-1.5 text-xs text-gray-500 dark:text-white/55">
                                                    Use a username only, not an email address.
                                                </p>
                                            ) : null}
                                        </div>
                                        <FloatingInput
                                            id="signup-referred-by"
                                            label="Referral Code or Link"
                                            value={form.referredBy}
                                            onChange={(e) => setForm((prev) => ({ ...prev, referredBy: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {/* ── STEP 2: Address ── */}
                            {formPage === 2 && (
                                <>
                                    <div className="space-y-1 pb-1">
                                        <p className="text-xs font-bold text-orange-500 dark:text-orange-400 uppercase tracking-widest">Address</p>
                                        <div className="h-px bg-gray-200 dark:bg-white/10" />
                                    </div>

                                    <FloatingInput id="signup-address" label="Street / House No." required
                                        value={form.address} onChange={set('address')} />

                                    <div className="sm:hidden">
                                        <NativeSelectField
                                            label={<>Region <span className="text-red-500">*</span></>}
                                            placeholder="Select Region"
                                            value={ph.regionCode}
                                            isLoading={ph.loadingRegions}
                                            onChange={(value) => {
                                                const option = ph.regions.find((r) => r.code === value)
                                                ph.setRegion(value, option?.name ?? value)
                                            }}
                                            options={ph.regions.map((region) => ({ value: region.code, label: region.name }))}
                                        />
                                    </div>
                                    <div className="hidden sm:block">
                                        <HeroSelectField
                                            label={<>Region <span className="text-red-500">*</span></>}
                                            placeholder="Select Region"
                                            selectedKey={ph.regionCode}
                                            selectedLabel={ph.regions.find((region) => region.code === ph.regionCode)?.name ?? ph.address.region}
                                            isLoading={ph.loadingRegions}
                                            onSelectionChange={(key) => {
                                                const value = key ? String(key) : ''
                                                const option = ph.regions.find((r) => r.code === value)
                                                ph.setRegion(value, option?.name ?? value)
                                            }}
                                        >
                                            {ph.regions.map((region) => (
                                                <ListBoxItem id={region.code} key={region.code}>{region.name}</ListBoxItem>
                                            ))}
                                        </HeroSelectField>
                                    </div>

                                    {!ph.noProvince && (
                                        <>
                                            <div className="sm:hidden">
                                                <NativeSelectField
                                                    label={<>Province <span className="text-red-500">*</span></>}
                                                    placeholder="Select Province"
                                                    value={ph.provinceCode}
                                                    isDisabled={!ph.regionCode || ph.loadingProvinces}
                                                    isLoading={ph.loadingProvinces}
                                                    onChange={(value) => {
                                                        const option = ph.provinces.find((p) => p.code === value)
                                                        ph.setProvince(value, option?.name ?? value)
                                                    }}
                                                    options={ph.provinces.map((province) => ({ value: province.code, label: province.name }))}
                                                />
                                            </div>
                                            <div className="hidden sm:block">
                                                <HeroSelectField
                                                    label={<>Province <span className="text-red-500">*</span></>}
                                                    placeholder="Select Province"
                                                    selectedKey={ph.provinceCode}
                                                    selectedLabel={ph.provinces.find((province) => province.code === ph.provinceCode)?.name ?? ph.address.province}
                                                    isDisabled={!ph.regionCode || ph.loadingProvinces}
                                                    isLoading={ph.loadingProvinces}
                                                    onSelectionChange={(key) => {
                                                        const value = key ? String(key) : ''
                                                        const option = ph.provinces.find((p) => p.code === value)
                                                        ph.setProvince(value, option?.name ?? value)
                                                    }}
                                                >
                                                    {ph.provinces.map((province) => (
                                                        <ListBoxItem id={province.code} key={province.code}>{province.name}</ListBoxItem>
                                                    ))}
                                                </HeroSelectField>
                                            </div>
                                        </>
                                    )}

                                    <div className="sm:hidden">
                                        <NativeSelectField
                                            label={<>City / Municipality <span className="text-red-500">*</span></>}
                                            placeholder="Select City / Municipality"
                                            value={ph.cityCode}
                                            isDisabled={ph.noProvince ? !ph.regionCode : (!ph.provinceCode || ph.loadingCities)}
                                            isLoading={ph.loadingCities || ph.loadingProvinces}
                                            onChange={(value) => {
                                                const option = ph.cities.find((c) => c.code === value)
                                                ph.setCity(value, option?.name ?? value)
                                            }}
                                            options={ph.cities.map((city) => ({ value: city.code, label: city.name }))}
                                        />
                                    </div>
                                    <div className="hidden sm:block">
                                        <HeroSelectField
                                            label={<>City / Municipality <span className="text-red-500">*</span></>}
                                            placeholder="Select City / Municipality"
                                            selectedKey={ph.cityCode}
                                            selectedLabel={ph.cities.find((city) => city.code === ph.cityCode)?.name ?? ph.address.city}
                                            isDisabled={ph.noProvince ? !ph.regionCode : (!ph.provinceCode || ph.loadingCities)}
                                            isLoading={ph.loadingCities || ph.loadingProvinces}
                                            onSelectionChange={(key) => {
                                                const value = key ? String(key) : ''
                                                const option = ph.cities.find((c) => c.code === value)
                                                ph.setCity(value, option?.name ?? value)
                                            }}
                                        >
                                            {ph.cities.map((city) => (
                                                <ListBoxItem id={city.code} key={city.code}>{city.name}</ListBoxItem>
                                            ))}
                                        </HeroSelectField>
                                    </div>

                                    <div className="sm:hidden">
                                        <NativeSelectField
                                            label={<>Barangay <span className="text-red-500">*</span></>}
                                            placeholder="Select Barangay"
                                            value={ph.address.barangay}
                                            isDisabled={!ph.cityCode || ph.loadingBarangays}
                                            isLoading={ph.loadingBarangays}
                                            onChange={(value) => ph.setBarangay(value)}
                                            options={ph.barangays.map((barangay) => ({ value: barangay.name, label: barangay.name }))}
                                        />
                                    </div>
                                    <div className="hidden sm:block">
                                        <HeroSelectField
                                            label={<>Barangay <span className="text-red-500">*</span></>}
                                            placeholder="Select Barangay"
                                            selectedKey={ph.address.barangay}
                                            selectedLabel={ph.barangays.find((barangay) => barangay.name === ph.address.barangay)?.name ?? ph.address.barangay}
                                            isDisabled={!ph.cityCode || ph.loadingBarangays}
                                            isLoading={ph.loadingBarangays}
                                            onSelectionChange={(key) => ph.setBarangay(key ? String(key) : '')}
                                        >
                                            {ph.barangays.map((barangay) => (
                                                <ListBoxItem id={barangay.name} key={barangay.code}>{barangay.name}</ListBoxItem>
                                            ))}
                                        </HeroSelectField>
                                    </div>

                                    <FloatingInput id="signup-zip" label="ZIP Code" maxLength={10} required
                                        value={form.zipCode} onChange={set('zipCode')} />
                                </>
                            )}

                            {/* ── STEP 3: Account Security ── */}
                            {formPage === 3 && (
                                <>
                                    <div className="space-y-1 pb-1">
                                        <p className="text-xs font-bold text-orange-500 dark:text-orange-400 uppercase tracking-widest">Account Security</p>
                                        <div className="h-px bg-gray-200 dark:bg-white/10" />
                                    </div>

                                    <div>
                                        <FloatingInput
                                            type={showPass ? 'text' : 'password'}
                                            id="signup-password"
                                            label="Password"
                                            required
                                            value={form.password}
                                            onChange={set('password')}
                                            endContent={(
                                                <button type="button" onClick={() => setShowPass(p => !p)}
                                                    className="text-gray-400 dark:text-white/60 hover:text-gray-700 dark:hover:text-white/80 transition-colors cursor-pointer">
                                                    <EyeIcon open={showPass} />
                                                </button>
                                            )}
                                        />
                                        <div className="mt-2 space-y-1.5">
                                            <div className="h-2 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: passwordStrength.width }} />
                                            </div>
                                            <p className={`text-[11px] font-medium ${passwordStrength.textColor}`}>{passwordStrength.label}</p>
                                            <div className="grid grid-cols-1 gap-1 pt-1">
                                                {passwordRequirements.map((item) => (
                                                    <p key={item.label} className={`text-[11px] flex items-center gap-2 ${item.passed ? 'text-emerald-600 dark:text-emerald-300' : 'text-gray-400 dark:text-white/55'}`}>
                                                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${item.passed ? 'bg-emerald-400' : 'bg-gray-300 dark:bg-white/25'}`} />
                                                        {item.label}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <FloatingInput
                                        type={showConfirm ? 'text' : 'password'}
                                        id="signup-confirm-password"
                                        label="Confirm Password"
                                        required
                                        value={form.confirmPassword}
                                        onChange={set('confirmPassword')}
                                        endContent={(
                                            <button type="button" onClick={() => setShowConfirm(p => !p)}
                                                className="text-gray-400 dark:text-white/60 hover:text-gray-700 dark:hover:text-white/80 transition-colors cursor-pointer">
                                                <EyeIcon open={showConfirm} />
                                            </button>
                                        )}
                                    />

                                    <p className="text-[11px] text-gray-400 dark:text-white/60 -mt-1">
                                        Use at least 8 characters with uppercase, lowercase, number, and special character.
                                    </p>

                                    <label className="flex items-start gap-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.agreeTerms}
                                            onChange={(e) => {
                                                const checked = e.target.checked
                                                setForm((prev) => ({ ...prev, agreeTerms: checked }))
                                                if (checked && error === 'You must agree to the Terms & Conditions.') {
                                                    setError('')
                                                }
                                            }}
                                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 dark:border-white/30 bg-white dark:bg-white/10 accent-orange-500"
                                        />
                                        <span className="text-xs text-gray-500 dark:text-white/60">
                                            I agree to{' '}
                                            <span className="text-orange-400 font-semibold hover:underline cursor-pointer">Terms &amp; Condition</span>
                                            {' '}&amp;{' '}
                                            <span className="text-orange-400 font-semibold hover:underline cursor-pointer">Privacy Policy</span>
                                        </span>
                                    </label>
                                </>
                            )}

                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 pt-2">
                        {formPage > 1 && (
                            <SecondaryButton
                                type="button"
                                onClick={handleBack}
                                className="flex-1"
                            >
                                ← Back
                            </SecondaryButton>
                        )}
                        {formPage < 3 ? (
                            <PrimaryButton
                                type="button"
                                onClick={handleNext}
                                className="flex-1"
                            >
                                Next →
                            </PrimaryButton>
                        ) : (
                            <PrimaryButton
                                type="submit"
                                disabled={isLoading}
                                className="flex-1"
                            >
                                {isLoading ? (
                                    <><Loading size={14} /><span>SENDING OTP...</span></>
                                ) : (
                                    <span>SIGN UP</span>
                                )}
                            </PrimaryButton>
                        )}
                    </div>

                </form>
            )}
        </motion.div>
    )
}
