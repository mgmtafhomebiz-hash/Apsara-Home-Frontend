export interface CategoryProduct {
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    badge?: string;
    brand?: string;
}

export const categoryProducts: Record<string, CategoryProduct[]> = {
    'chairs-stools': [
        { name: 'Nordic Accent Chair', price: 4500, originalPrice: 5500, image: '/Images/HeroSection/chairs_stools.jpg', badge: 'SALE', brand: 'AfroniaHome' },
        { name: 'Bar Stool Set (2pcs)', price: 2800, image: '/Images/HeroSection/chairs_stools.jpg', badge: 'NEW', brand: 'MediaIndia' },
        { name: 'Velvet Dining Chair', price: 3200, originalPrice: 4000, image: '/Images/HeroSection/chairs_stools.jpg', badge: 'SALE', brand: 'AfroniaHome' },
        { name: 'Ergonomic Office Chair', price: 7500, image: '/Images/HeroSection/chairs_stools.jpg', brand: 'Bonnevie' },
        { name: 'Rattan Accent Stool', price: 1800, image: '/Images/HeroSection/chairs_stools.jpg', brand: 'MEDFORM' },
        { name: 'Stackable Counter Stool', price: 2200, originalPrice: 2800, image: '/Images/HeroSection/chairs_stools.jpg', badge: '20% OFF', brand: 'MediaIndia' },
    ],
    'dining-table': [
        { name: 'Solid Oak Dining Table', price: 18500, image: '/Images/HeroSection/Dinning_table.jpg', badge: 'NEW', brand: 'AfroniaHome' },
        { name: 'Glass Top Dining Set', price: 12000, originalPrice: 15000, image: '/Images/HeroSection/Dinning_table.jpg', badge: 'SALE', brand: 'Bonnevie' },
        { name: 'Extendable Dining Table', price: 21000, image: '/Images/HeroSection/Dinning_table.jpg', brand: 'AfroniaHome' },
        { name: 'Round Marble Dining Table', price: 25000, image: '/Images/HeroSection/Dinning_table.jpg', badge: 'PREMIUM', brand: 'MEDFORM' },
        { name: 'Rustic Wooden Table', price: 9500, originalPrice: 12000, image: '/Images/HeroSection/Dinning_table.jpg', badge: 'SALE', brand: 'MediaIndia' },
        { name: '6-Seater Dining Set', price: 32000, image: '/Images/HeroSection/Dinning_table.jpg', brand: 'AfroniaHome' },
    ],
    'sofas': [
        { name: 'GAYNOUR L-Shape Fabric Sofa', price: 13700, image: '/Images/FeaturedSection/gaynour_l-shape.jpg', badge: 'NEW', brand: 'AfroniaHome' },
        { name: 'SARAH Corner L-Shape Sofa', price: 8547, originalPrice: 11000, image: '/Images/FeaturedSection/sarah_corner_l-shaped.png', badge: 'SALE', brand: 'Bonnevie' },
        { name: '3-Seater Velvet Sofa', price: 15000, image: '/Images/HeroSection/sofas.jpg', brand: 'MediaIndia' },
        { name: 'Modern Recliner Sofa', price: 22000, originalPrice: 28000, image: '/Images/HeroSection/sofas.jpg', badge: 'SALE', brand: 'AfroniaHome' },
        { name: 'Compact Loveseat Sofa', price: 7800, image: '/Images/HeroSection/sofas.jpg', badge: 'NEW', brand: 'MEDFORM' },
        { name: 'Sectional Modular Sofa', price: 35000, image: '/Images/FeaturedSection/home_living.jpg', brand: 'AfroniaHome' },
    ],
    'tv-rack': [
        { name: 'Floating TV Cabinet', price: 6500, image: '/Images/HeroSection/tv_racks.jpg', badge: 'NEW', brand: 'MediaIndia' },
        { name: 'Industrial TV Stand', price: 4800, originalPrice: 6000, image: '/Images/HeroSection/tv_racks.jpg', badge: 'SALE', brand: 'Bonnevie' },
        { name: 'Minimalist TV Unit', price: 8200, image: '/Images/HeroSection/tv_racks.jpg', brand: 'AfroniaHome' },
        { name: 'Entertainment Center', price: 12500, image: '/Images/HeroSection/tv_racks.jpg', brand: 'MEDFORM' },
        { name: 'Corner TV Rack', price: 5500, originalPrice: 7000, image: '/Images/HeroSection/tv_racks.jpg', badge: '20% OFF', brand: 'MediaIndia' },
        { name: 'Chest TV Console', price: 9800, image: '/Images/FeaturedSection/bently_chest_drawer.png', badge: 'NEW', brand: 'AfroniaHome' },
    ],
};

export const categoryMeta: Record<string, { label: string; image: string }> = {
    'chairs-stools': { label: 'Chairs & Stools', image: '/Images/HeroSection/chairs_stools.jpg' },
    'dining-table': { label: 'Dining Table', image: '/Images/HeroSection/Dinning_table.jpg' },
    'sofas': { label: 'Sofas', image: '/Images/HeroSection/sofas.jpg' },
    'tv-rack': { label: 'TV Rack', image: '/Images/HeroSection/tv_racks.jpg' },
};

export const CATEGORY_BRANDS = ['AfroniaHome', 'MediaIndia', 'Bonnevie', 'MEDFORM'];

export const PRICE_MAX = 50000;
