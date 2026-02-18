'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const EyeIcon = ({ open }: { open: boolean }) => open
    ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
    : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>

const inputClass = "w-full px-4 py-3 bg-white/15 border border-white/25 rounded-xl text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400/60 focus:bg-white/20 transition-all"
const labelClass = "block text-xs font-semibold text-white/80 mb-1.5"

interface SignUpFormProps {
    onSwitchToLogin: () => void
}

export default function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
    const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
        >
            <h2 className="text-2xl font-bold text-white mb-1">Let&apos;s Get Started!</h2>
            <p className="text-white/70 text-sm mb-6">Please enter your details to start your online application</p>

            <div className="space-y-4">

                {/* Row 1 — First + Last Name */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>First Name <span className="text-orange-400">*</span></label>
                        <input type="text" placeholder="First name" className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Last Name <span className="text-orange-400">*</span></label>
                        <input type="text" placeholder="Last name" className={inputClass} />
                    </div>
                </div>

                {/* Row 2 — Middle Name (full) */}
                <div>
                    <label className={labelClass}>Middle Name <span className="text-orange-400">*</span></label>
                    <input type="text" placeholder="Middle name" className={inputClass} />
                </div>

                {/* Row 3 — Birth Date + Email */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>Birth Date <span className="text-orange-400">*</span></label>
                        <input type="date" className={`${inputClass} scheme-dark`} />
                    </div>
                    <div>
                        <label className={labelClass}>Email Address <span className="text-orange-400">*</span></label>
                        <input type="email" placeholder="Enter email" className={inputClass} />
                    </div>
                </div>

                {/* Row 4 — Phone Number (full) */}
                <div>
                    <label className={labelClass}>Phone Number <span className="text-orange-400">*</span></label>
                    <div className="flex gap-2">
                        <div className="flex items-center justify-center px-4 bg-white/10 border border-white/20 rounded-xl text-sm text-white/80 font-semibold shrink-0">
                            +63
                        </div>
                        <input type="tel" placeholder="9XX XXX XXXX" className={inputClass} />
                    </div>
                </div>

                {/* Row 5 — Username + Referred By */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>Username / Affiliate Link <span className="text-orange-400">*</span></label>
                        <input type="text" placeholder="Username" className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Referred By <span className="text-orange-400">*</span></label>
                        <input type="text" placeholder="Referral code" className={inputClass} />
                    </div>
                </div>

                {/* Row 6 — Password + Confirm Password */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>Password <span className="text-orange-400">*</span></label>
                        <div className="relative">
                            <input type={showPass ? 'text' : 'password'} placeholder="Password" className={`${inputClass} pr-11`} />
                            <button type="button" onClick={() => setShowPass(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors">
                                <EyeIcon open={showPass} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Confirm Password <span className="text-orange-400">*</span></label>
                        <div className="relative">
                            <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm" className={`${inputClass} pr-11`} />
                            <button type="button" onClick={() => setShowConfirm(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors">
                                <EyeIcon open={showConfirm} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sign In link */}
                <p className="text-xs text-white/60">
                    Have an account?{' '}
                    <button onClick={onSwitchToLogin} className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                        Sign In
                    </button>
                </p>

                {/* Terms */}
                <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" className="accent-orange-500 w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs text-white/60">
                        I agree to{' '}
                        <span className="text-orange-400 font-semibold hover:underline cursor-pointer">Terms &amp; Condition</span>
                        {' '}&amp;{' '}
                        <span className="text-orange-400 font-semibold hover:underline cursor-pointer">Privacy Policy</span>
                    </span>
                </label>

                <button className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-3 rounded-xl text-sm tracking-widest transition-all duration-200 shadow-lg shadow-orange-500/30">
                    REGISTER
                </button>
            </div>
        </motion.div>
    )
}
