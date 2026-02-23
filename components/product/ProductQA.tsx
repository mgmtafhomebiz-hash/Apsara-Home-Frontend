'use client';

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const faqs = [
    {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 3–7 business days within Metro Manila, and 5–10 business days for provincial areas via LBC or J&T Express. You will receive a tracking number once your order has been dispatched.'
    },
    {
        q: 'Is assembly required and do you offer assembly services?',
        a: 'Most items require minimal assembly and come with all required tools and an instruction manual. Free assembly is available for orders delivered within Metro Manila — just request it at checkout.'
    },
    {
        q: 'What is your return and refund policy?',
        a: 'We offer a 30-day return policy for unused items in their original packaging. If the product arrives damaged or defective, contact us within 48 hours with photos and we will arrange a free replacement or full refund.'
    },
    {
        q: 'Can I customize the color or material?',
        a: 'Yes! Most of our furniture pieces are available in multiple colors and material options. Select your preferred configuration using the options on this page. For bespoke requests outside the listed options, please contact us directly.'
    },
    {
        q: 'What warranty is included?',
        a: 'All products come with a 1-year limited manufacturer warranty covering defects in materials and workmanship. The warranty does not cover normal wear and tear, misuse, or damage caused by improper assembly.'
    },
    {
        q: 'What payment methods do you accept?',
        a: 'We accept GCash, Maya, Visa, Mastercard, and Cash on Delivery (COD). For orders above ₱10,000, installment options via credit card are also available at checkout.'
    },
];

const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const ProductQA = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-12 sm:mt-16"
        >
            <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>

            <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                {faqs.map((faq, i) => (
                    <div key={faq.q}>
                        <button
                            onClick={() => toggle(i)}
                            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50/60 transition-colors"
                        >
                            <span className={`text-sm font-semibold transition-colors ${openIndex === i ? 'text-orange-500' : 'text-slate-800'}`}>
                                {faq.q}
                            </span>
                            <span className={`shrink-0 transition-colors ${openIndex === i ? 'text-orange-400' : 'text-gray-400'}`}>
                                <ChevronIcon open={openIndex === i} />
                            </span>
                        </button>

                        <AnimatePresence initial={false}>
                            {openIndex === i && (
                                <motion.div
                                    key="answer"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">
                                        {faq.a}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default ProductQA;
