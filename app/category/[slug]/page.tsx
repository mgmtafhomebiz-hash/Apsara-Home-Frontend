'use client';

import CategoryListProductMain from '@/components/category/CategoryListProductMain';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    return <CategoryListProductMain params={params} />;
}
