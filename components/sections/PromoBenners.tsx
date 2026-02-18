'use client';

import { motion } from "framer-motion";
import Image from "next/image";

const PromoBenners = () => {
    return (
        <section className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ y: -4 }}
                    className="relative rounded-3xl overflow-hidden h-96 cursor-pointer group"
                >
                    <Image
                        src="/Images/PromoBanners/ct2-img1-large.jpg" alt="Furniture"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-2">Limited Offer</p>
                        <h3 className="text-white text-2xl font-bold mb-1 leading-tight">Build Your Home<br />with Furniture</h3>
                        <p className="text-white/60 text-sm mb-5">Starting from ₱2,999</p>
                        <button className="self-start bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 group/btn">
                            Shop Now
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover/btn:translate-x-1 transition-transform"><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    whileHover={{ y: -4 }}
                    className="relative rounded-3xl overflow-hidden h-96 cursor-pointer group"
                >
                    <Image src="/Images/PromoBanners/ct2-img2-large.jpg" alt="Appliances" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-linear-to-t from-sky-900/90 via-sky-900/40 to-transparent" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <p className="text-sky-300 text-xs font-semibold uppercase tracking-widest mb-2">New Collection</p>
                        <h3 className="text-white text-2xl font-bold mb-1 leading-tight">Choose Your<br />Best Appliance</h3>
                        <p className="text-white/60 text-sm mb-5">Up to 40% off this week</p>
                        <button className="self-start bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 group/btn">
                            Explore
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover/btn:translate-x-1 transition-transform"><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default PromoBenners
