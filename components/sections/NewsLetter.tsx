'use client';

import { motion } from "framer-motion";
import { useState } from "react";

const NewsLetter = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) setSubscribed(true)
    }
    return (
        <section className="bg-gray-100 dark:bg-slate-900 py-16 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-500 dark:text-orange-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,12 2,6" /></svg>
                        Newsletter
                    </div>
                    <h2 className="text-gray-900 dark:text-white text-3xl font-bold mb-3">Stay in the Loop</h2>
                    <p className="text-gray-600 dark:text-white/50 mb-8">Get the exclusive deals, new arrivals & interior tips to your inbox. </p>

                    {subscribed ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-green-500/20 text-green-600 dark:text-green-400 py-4 px-6 rounded-2xl font-medium"
                        >
                           🎉 You&apos;re subscribed! Welcome to AF Home family.
                        </motion.div>
                    ): (
                        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="flex-1 px-4 py-3 bg-white dark:bg-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 rounded-xl border border-gray-300 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                            />
                            <button type="submit" className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-full px-8 py-3 text-base cursor-pointer transition-all duration-200">
                                Subscribe
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    )
}

export default NewsLetter
