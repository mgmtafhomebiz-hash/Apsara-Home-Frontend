'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MemberStatus, MemberTier } from '@/types/members/types'

interface AddMemberForm {
  name: string
  email: string
  status: MemberStatus
  tier: MemberTier
}

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AddMemberForm) => Promise<void> | void
  isLoading?: boolean
  serverError?: string | null
}

const defaultForm: AddMemberForm = {
  name: '',
  email: '',
  status: 'pending',
  tier: 'Home Starter',
}

const validateField = (field: keyof AddMemberForm, value: string): string | undefined => {
  switch (field) {
    case 'name': {
      const trimmed = value.trim()
      if (!trimmed) return 'Full name is required'
      if (trimmed.length < 2) return 'Name must be at least 2 characters'
      if (trimmed.length > 100) return 'Name must not exceed 100 characters'
      if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) return 'Name can only contain letters, spaces, hyphens, and apostrophes'
      return undefined
    }
    case 'email': {
      const trimmed = value.trim()
      if (!trimmed) return 'Email address is required'
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(trimmed)) return 'Please enter a valid email address'
      if (trimmed.length > 255) return 'Email is too long'
      return undefined
    }
    default:
      return undefined
  }
}

export default function AddMemberModal({ isOpen, onClose, onSubmit, isLoading = false, serverError = null }: AddMemberModalProps) {
  const [form, setForm] = useState<AddMemberForm>(defaultForm)
  const [errors, setErrors] = useState<Partial<Record<keyof AddMemberForm, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof AddMemberForm, boolean>>>({})

  const validate = () => {
    const e: Partial<Record<keyof AddMemberForm, string>> = {}
    const nameError = validateField('name', form.name)
    const emailError = validateField('email', form.email)
    if (nameError) e.name = nameError
    if (emailError) e.email = emailError
    return e
  }

  const handleFieldChange = (field: keyof AddMemberForm, value: string) => {
    setForm(p => ({ ...p, [field]: value }))
    // Real-time validation for touched fields
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(p => error ? { ...p, [field]: error } : { ...p, [field]: undefined })
    }
  }

  const handleFieldBlur = (field: keyof AddMemberForm) => {
    setTouched(p => ({ ...p, [field]: true }))
    const error = validateField(field, form[field])
    setErrors(p => error ? { ...p, [field]: error } : { ...p, [field]: undefined })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Mark all fields as touched
    setTouched({ name: true, email: true, status: true, tier: true })

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    try {
      await onSubmit(form)
      setForm(defaultForm)
      setErrors({})
      setTouched({})
      onClose()
    } catch (error) {
      // Error is handled by parent component via serverError prop
    }
  }

  const handleClose = () => {
    setForm(defaultForm)
    setErrors({})
    setTouched({})
    onClose()
  }

  const isFormValid = Object.keys(validate()).length === 0
  const canSubmit = isFormValid && !isLoading && !serverError

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-sky-500 dark:bg-sky-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-gray-900 dark:text-white font-bold text-base leading-none">Add New Member</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Enter member details to create account</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="h-8 w-8 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

                {/* Server Error Alert */}
                {serverError && (
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950">
                    <svg className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-red-700 dark:text-red-300 text-xs">{serverError}</p>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    {form.name && !errors.name && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        Valid
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      onBlur={() => handleFieldBlur('name')}
                      disabled={isLoading}
                      placeholder="e.g. Juan dela Cruz"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed
                        ${errors.name && touched.name
                          ? 'h-11 w-full rounded-[18px] border border-red-300 bg-red-50 px-4 text-sm text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 focus:border-red-500 focus:bg-red-50 focus:ring-0 dark:border-red-800 dark:bg-red-950 dark:text-white dark:placeholder-gray-500'
                          : 'h-11 w-full rounded-[18px] border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-sky-400 focus:bg-white focus:ring-0 dark:border-white/18 dark:bg-white/12 dark:text-white dark:placeholder-white/55'
                      }`}
                    />
                  </div>
                  {errors.name && touched.name && (
                    <p className="text-red-600 dark:text-red-400 text-xs mt-1.5 flex items-start gap-1.5">
                      <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                      </svg>
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    {form.email && !errors.email && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        Valid
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      onBlur={() => handleFieldBlur('email')}
                      disabled={isLoading}
                      placeholder="e.g. juan@afhome.com"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed
                        ${errors.email && touched.email
                          ? 'h-11 w-full rounded-[18px] border border-red-300 bg-red-50 px-4 text-sm text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 focus:border-red-500 focus:bg-red-50 focus:ring-0 dark:border-red-800 dark:bg-red-950 dark:text-white dark:placeholder-gray-500'
                          : 'h-11 w-full rounded-[18px] border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-sky-400 focus:bg-white focus:ring-0 dark:border-white/18 dark:bg-white/12 dark:text-white dark:placeholder-white/55'
                      }`}
                    />
                  </div>
                  {errors.email && touched.email && (
                    <p className="text-red-600 dark:text-red-400 text-xs mt-1.5 flex items-start gap-1.5">
                      <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                      </svg>
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Status + Tier side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm(p => ({ ...p, status: e.target.value as MemberStatus }))}
                      disabled={isLoading}
                      className="h-11 w-full rounded-[18px] border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-sky-400 focus:bg-white focus:ring-0 dark:border-white/18 dark:bg-white/12 dark:text-white dark:placeholder-white/55 dark:focus:border-sky-400/60 dark:focus:bg-white/18 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="blocked">Blocked</option>
                      <option value="kyc_review">KYC Review</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tier</label>
                    <select
                      value={form.tier}
                      onChange={(e) => setForm(p => ({ ...p, tier: e.target.value as MemberTier }))}
                      disabled={isLoading}
                      className="h-11 w-full rounded-[18px] border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-sky-400 focus:bg-white focus:ring-0 dark:border-white/18 dark:bg-white/12 dark:text-white dark:placeholder-white/55 dark:focus:border-sky-400/60 dark:focus:bg-white/18 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="Home Starter">🏠 Home Starter</option>
                      <option value="Home Builder">🧱 Home Builder</option>
                      <option value="Home Stylist">✨ Home Stylist</option>
                      <option value="Lifestyle Consultant">📈 Lifestyle Consultant</option>
                      <option value="Lifestyle Elite">💎 Lifestyle Elite</option>
                    </select>
                  </div>
                </div>

                {/* Info note */}
                <div className="flex items-start gap-2.5 p-3 rounded-lg border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950">
                  <svg className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p className="text-xs text-sky-700 dark:text-sky-300 leading-relaxed">
                    Orders, earnings, and referral data will start at <strong>0</strong> and update automatically as the member uses the platform.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2
                      ${canSubmit
                        ? 'bg-sky-600 dark:bg-sky-700 hover:bg-sky-700 dark:hover:bg-sky-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {isLoading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                        Adding...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                        </svg>
                        Add Member
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
