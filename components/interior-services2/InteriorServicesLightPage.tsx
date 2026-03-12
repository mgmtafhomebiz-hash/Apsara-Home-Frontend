'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

type FormState = {
  serviceType: string
  projectScope: string
  preferredDate: string
  preferredTime: string
  fullName: string
  email: string
  phone: string
  notes: string
}

const SERVICE_OPTIONS = [
  {
    title: 'Residential Design',
    subtitle: 'Space planning, styling, and furniture direction',
  },
  {
    title: 'Commercial Interiors',
    subtitle: 'Customer-facing spaces with stronger brand presence',
  },
  {
    title: 'Renovation Planning',
    subtitle: 'Refresh existing rooms without losing structure and warmth',
  },
]

const DEFAULT_FORM: FormState = {
  serviceType: '',
  projectScope: '',
  preferredDate: '',
  preferredTime: '',
  fullName: '',
  email: '',
  phone: '',
  notes: '',
}

const inputClassName =
  'w-full rounded-2xl border border-[#d7cfc4] bg-white px-4 py-3 text-sm text-[#3f352c] outline-none transition-all placeholder:text-[#9c8f82] focus:border-[#0f8d88] focus:ring-4 focus:ring-[#0f8d88]/10'

export default function InteriorServicesLightPage() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const summary = useMemo(
    () => [
      { label: 'Service', value: form.serviceType || 'Not selected' },
      { label: 'Scope', value: form.projectScope || 'Not selected' },
      { label: 'Preferred Date', value: form.preferredDate || 'Not selected' },
      { label: 'Preferred Time', value: form.preferredTime || 'Not selected' },
    ],
    [form.preferredDate, form.preferredTime, form.projectScope, form.serviceType],
  )

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = () => {
    if (!form.serviceType || !form.preferredDate || !form.preferredTime || !form.fullName || !form.email) {
      setError('Please complete the required details before submitting your request.')
      return
    }

    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-[#f6f0e8] text-[#2f261f]">
      <section className="relative overflow-hidden border-b border-[#eadfd3] bg-[linear-gradient(180deg,#f8f3ed_0%,#f4ede3_100%)]">
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top_right,rgba(15,141,136,0.16),transparent_42%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative z-10"
          >
            <span className="inline-flex rounded-full border border-[#d8cec3] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a6959]">
              AF Home Interior Services
            </span>
            <h1 className="mt-6 max-w-xl font-['Cormorant_Garamond'] text-[clamp(3rem,5vw,5.2rem)] font-light leading-[0.95] text-[#241b15]">
              A lighter,
              <br />
              warmer booking
              <br />
              experience.
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#6c5b4d]">
              This version keeps the premium feel of your current concept, but
              aligns more closely with the rest of AF Home by using warmer light
              tones, softer cards, and a friendlier consultation layout.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['Consultation-first', 'Clear service framing before the form starts'],
                ['Brand-consistent', 'Closer to your storefront palette and tone'],
                ['Trust-building', 'Cleaner contact and scheduling presentation'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-[#e3d7ca] bg-white/85 p-4 shadow-[0_12px_40px_rgba(91,73,56,0.05)]">
                  <p className="text-sm font-semibold text-[#2f261f]">{title}</p>
                  <p className="mt-2 text-xs leading-5 text-[#7b6c5f]">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.06 }}
            className="relative z-10"
          >
            <div className="rounded-[28px] border border-[#e3d7ca] bg-white p-6 shadow-[0_20px_60px_rgba(91,73,56,0.08)] md:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a7868]">Book a consultation</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#2f261f]">Start your project enquiry</h2>
                </div>
                <div className="rounded-2xl bg-[#0f8d88]/10 px-3 py-2 text-right">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#0f8d88]">Response Time</p>
                  <p className="text-sm font-semibold text-[#0f8d88]">Within 24 hours</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <select
                  value={form.serviceType}
                  onChange={(e) => updateField('serviceType', e.target.value)}
                  className={inputClassName}
                >
                  <option value="">Select service type</option>
                  {SERVICE_OPTIONS.map((option) => (
                    <option key={option.title} value={option.title}>
                      {option.title}
                    </option>
                  ))}
                </select>
                <select
                  value={form.projectScope}
                  onChange={(e) => updateField('projectScope', e.target.value)}
                  className={inputClassName}
                >
                  <option value="">Select project scope</option>
                  <option value="One room">One room</option>
                  <option value="Multiple rooms">Multiple rooms</option>
                  <option value="Whole home">Whole home</option>
                  <option value="Commercial unit">Commercial unit</option>
                </select>
                <input
                  type="date"
                  value={form.preferredDate}
                  onChange={(e) => updateField('preferredDate', e.target.value)}
                  className={inputClassName}
                />
                <select
                  value={form.preferredTime}
                  onChange={(e) => updateField('preferredTime', e.target.value)}
                  className={inputClassName}
                >
                  <option value="">Select preferred time</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                </select>
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className={`${inputClassName} md:col-span-2`}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={inputClassName}
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className={inputClassName}
                />
                <textarea
                  rows={5}
                  placeholder="Tell us about your space, goals, preferred style, and any important notes."
                  value={form.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  className={`${inputClassName} min-h-[140px] resize-none md:col-span-2`}
                />
              </div>

              {error && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {submitted && (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  Light version preview submitted successfully. This is currently a frontend-only comparison route.
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#efe4d8] pt-5">
                <p className="text-xs leading-5 text-[#847466]">
                  By sending this enquiry, our team can contact you using the information you provided.
                </p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="rounded-2xl bg-[#0f8d88] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,141,136,0.22)] transition-colors hover:bg-[#0c7773]"
                >
                  Submit enquiry
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7868]">Service Snapshot</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#2a211b]">A lighter direction that still feels premium</h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#726255]">
              Instead of a dark editorial mood, this version leans into warm
              ivory surfaces, soft stone borders, and teal actions. It feels more
              integrated with your current AF Home storefront while keeping the
              consultation page distinct from product pages.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {SERVICE_OPTIONS.map((service) => (
                <div key={service.title} className="rounded-[24px] border border-[#e4d8cc] bg-white p-5 shadow-[0_12px_40px_rgba(91,73,56,0.05)]">
                  <p className="text-base font-semibold text-[#2f261f]">{service.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#7b6c5f]">{service.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#e4d8cc] bg-[#fffaf5] p-6 shadow-[0_12px_40px_rgba(91,73,56,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7868]">Booking Summary Preview</p>
            <div className="mt-5 space-y-3">
              {summary.map((item) => (
                <div key={item.label} className="flex items-start justify-between rounded-2xl border border-[#eadfd3] bg-white px-4 py-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a7868]">{item.label}</span>
                  <span className="max-w-[58%] text-right text-sm text-[#4b4036]">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#0f8d88]/8 px-4 py-4">
              <p className="text-sm font-semibold text-[#0f6f6b]">Recommended use</p>
              <p className="mt-2 text-sm leading-6 text-[#5f6a69]">
                Better if you want the Interior Services page to feel like part of
                AF Home rather than a separate luxury microsite.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
