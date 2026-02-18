'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import ProductCard from "../ui/ProductCard";

const products = [
    { name: 'Bently Chest Drawer', price: 2600, originalPrice: 2020, image: '/Images/FeaturedSection/bently_chest_drawer.png', badge: 'SALE' },
    { name: 'ZOOEY Cutlery', price: 119, originalPrice: 9500, image: '/Images/FeaturedSection/zooey_cutlery.png', badge: '25% OFF' },
    { name: 'GAYNOUR L-Shape Fabric Sofa', price: 13700, image: '/Images/FeaturedSection/gaynour_l-shape.jpg', badge: 'NEW' },
    { name: 'SARAH Corner L-Shape Fabric Sofa', price: 8547, originalPrice: 11000, image: '/Images/FeaturedSection/sarah_corner_l-shaped.png', badge: 'SALE' },
]

const FeaturedSections = () => {
    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="relative rounded-3xl overflow-hidden aspect-[4/5] group cursor-pointer"
                    >
                        <Image
                            src="/Images/FeaturedSection/home_living.jpg"
                            alt="Home Living"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-8 left-8 rigt-8">
                            <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-2">Featured</p>
                            <h2 className="text-white text-3xl font-bold mb-3 leading-tight">Minimal &<br />Simple Design</h2>
                            <p className="text-white/60 text-sm mb-5">Crafted for the moderm home.</p>
                            <button className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 group/btn">
                                Shop Collection
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover/btn:translate-x-1 transition-transform"><polyline points="9 18 15 12 9 6" /></svg>
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Product Grid  */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <p className="text-orange-500 text-sm font-semibold uppercase tracking-wider mb-2">Sale Items</p>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Top Picks This Week</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {products.map((product, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ProductCard 
                                    {...product}
                                />
                            </motion.div>
                        ))}
                        </div>
                        
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default FeaturedSections
