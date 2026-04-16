'use client'

import { useState } from 'react'

export default function ShopNewsletterSignup({
  badge,
  heading,
  description,
  button,
}: {
  badge: string
  heading: string
  description: string
  button: string
}) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return (
    <section className="bg-gray-100 dark:bg-slate-900 py-16 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-1.5 text-sm font-semibold text-orange-500 dark:text-orange-300">
            {badge}
          </div>
          <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-gray-100">{heading}</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-300">{description}</p>

          {subscribed ? (
            <div className="rounded-2xl bg-green-500/20 px-6 py-4 font-medium text-green-600 dark:text-green-400">
              Subscription received. Watch your inbox for AF Home updates.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-3">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email address"
                className="flex-1 rounded-xl border border-gray-300 dark:border-white/20 bg-white dark:bg-gray-800/50 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-full px-8 py-3 text-base cursor-pointer">
                {button}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
