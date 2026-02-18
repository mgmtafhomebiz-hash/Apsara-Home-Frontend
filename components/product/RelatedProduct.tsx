'use client';

import { CategoryProduct } from "@/libs/CategoryData";
import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "../ui/ProductCard";

const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
);

interface RelatedProductProps {
    products: CategoryProduct[];
    category: string
}

const RelatedProducts = ({ products, category }: RelatedProductProps) => {
    
  if (products.length === 0) return null;  

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate=900">You Migh Also Like</h2>
        <Link href={`/category/${category}`} className="text-sm text-orange-500 hover:text-orange-600 font-semibol transition-colors flex items-center gap-1">
            View all <ChevronRight />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
            <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.08}}
            >
                <ProductCard {...product}/>
            </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default RelatedProducts
