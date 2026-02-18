'use client';

import { use, useRef } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductTabs from '@/components/product/ProductTabs';
import { categoryProducts, categoryMeta, getProductBySlug } from '@/libs/CategoryData';
import RelatedProducts from '@/components/product/RelatedProduct';
import StickyAddToCart from '@/components/product/StickyAddToCart';
import ProductQA from '@/components/product/ProductQA';
import CompleteTheLook from '@/components/product/CompleteTheLook';
// import CompleteTheLook from '@/components/product/CompleteTheLook';

const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
);

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const tabsRef = useRef<HTMLDivElement>(null);

    const result = getProductBySlug(slug);
    if (!result) return notFound();

    const { product, category } = result;
    const relatedProducts = categoryProducts[category]
        .filter(p => p.name.toLowerCase().replace(/\s+/g, '-') !== slug)
        .slice(0, 4);

    const scrollToReviews = () => {
        tabsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <StickyAddToCart product={product}/>
            <TopBar />
            <Navbar />

            <main className="flex-1">
                {/* Breadcrumb */}
                <div className="bg-gray-50 border-b border-gray-100">
                    <div className="container mx-auto px-4 py-3">
                        <nav className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Link href="/" className="hover:text-orange-500 transition-colors font-medium">Home</Link>
                            <ChevronRight />
                            <Link href={`/category/${category}`} className="hover:text-orange-500 transition-colors">
                                {categoryMeta[category]?.label}
                            </Link>
                            <ChevronRight />
                            <span className="text-slate-600 font-semibold truncate max-w-48">{product.name}</span>
                        </nav>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-10">
                    {/* Product Main */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <ProductImageGallery product={product} />
                        <ProductInfo product={product} onReviewsClick={scrollToReviews} />
                    </div>

                    {/* Tabs */}
                    <div ref={tabsRef}>
                        <ProductTabs product={product} />
                    </div>

                    {/* Q&A */}
                    <ProductQA />

                    {/* Related */}
                    <RelatedProducts products={relatedProducts} category={category} />

                    {/* Complete the Look */}
                    <CompleteTheLook currentCategory={category} />
                </div>
            </main>

            <Footer />
        </div>
    );
}
