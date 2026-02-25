'use client';

import { motion } from "framer-motion";
import CategoryCard from "../category/CategoryCard";

const categories = [
    { name: 'Chairs & Stools', count: 14, image: '/Images/HeroSection/chairs_stools.jpg' },
    { name: 'Dining Table', count: 6, image: '/Images/HeroSection/Dinning_table.jpg' },
    { name: 'Sofas', count: 56, image: '/Images/HeroSection/sofas.jpg' },
    { name: 'TV Rack', count: 24, image: '/Images/HeroSection/tv_racks.jpg' },
];

const HeroSection = () => {
    return (
        <section className="container mx-auto px-4 py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
            >
                <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-2">Shop by Category</p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                    Find Your Perfect <span>Furniture</span>
                </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((category, index) => (
                    <CategoryCard
                        key={index}
                        {...category}
                        index={index}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSection;
