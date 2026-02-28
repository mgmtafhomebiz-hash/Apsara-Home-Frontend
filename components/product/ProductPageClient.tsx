'use client';

import { useCallback, useState } from 'react';
import type { CategoryProduct } from '@/libs/CategoryData';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';

interface ProductPageClientProps {
    product: CategoryProduct;
    categoryLabel: string;
}

const ProductPageClient = ({ product, categoryLabel }: ProductPageClientProps) => {
    const [activeVariantImage, setActiveVariantImage] = useState<string | undefined>(undefined);

    const handleVariantChange = useCallback((images: string[]) => {
        setActiveVariantImage(images[0]);
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <ProductImageGallery product={product} activeVariantImage={activeVariantImage} />
            <ProductInfo product={product} categoryLabel={categoryLabel} onVariantChange={handleVariantChange} />
        </div>
    );
};

export default ProductPageClient;
