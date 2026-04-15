'use client'

import Image from 'next/image';
import { useCart } from "@/context/CartContext";
import { CategoryProduct } from "@/libs/CategoryData";
import { displayColorName } from "@/libs/colorUtils";
import { extractVariantOptionLabels } from "@/libs/productVariantOptions";
import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react";
import { Link2, X as XIcon } from "lucide-react";
import StarRating from "../ui/StarRating";
import BuyNowOptionsModal from "./BuyNowOptionsModal";
import { useSession } from "next-auth/react";
import { useMeQuery } from "@/store/api/userApi";
import type { ProductReviewSummary } from "@/store/api/productsApi";
import OutlineButton from "@/components/ui/buttons/OutlineButton";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

// Brand Profile Component
const BrandProfile = ({ product }: { product: CategoryProduct }) => {
    if (!product.brand) return null;
    
    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-lg">
            <div className="flex items-center gap-4">
                <div className={`relative h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600`}>
                    <span className="text-3xl font-bold text-gray-400 dark:text-gray-500">
                        {product.brand.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{product.brand}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Official {product.brand} Store</p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="16" y1="10" x2="21" y2="10" />
                            </svg>
                            <span>Chat Performance: 95%</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                            <span>Overall Rating: 4.8</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="16" y1="10" x2="21" y2="10" />
                                <line x1="3" y1="2" x2="3" y2="6" />
                            </svg>
                            <span>Total Products: 24</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 2L3 6v14a2 2 0 0 1 2 2h14a2 2 0 0 1 2 2V6l-3-4z" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="16" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span>Joined: Jan 2024</span>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const brandUrl = window.location.href;
                            navigator.clipboard.writeText(brandUrl).then(() => {
                                // Success feedback could be added here
                            }).catch(() => {
                                // Error feedback could be added here
                            })
                        }}
                        className="absolute top-4 right-4 p-2 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-orange-500 hover:border-orange-500 dark:hover:bg-orange-500 dark:hover:border-orange-500 hover:text-white transition-all duration-200 cursor-pointer"
                        title="Share Brand"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700 dark:text-gray-300 hover:text-white transition-colors">
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);
const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);
const HeartIcon = ({ filled }: { filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
        fill={filled ? '#f97316' : 'none'}
        stroke={filled ? '#f97316' : 'currentColor'}
        strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const PRODUCT_TYPE_LABELS: Record<number, string> = {
    0: 'Regular',
    1: 'Variant',
    2: 'Bundle',
}
const NEW_BADGE_DAYS = 3;

const isNewProduct = (createdAt?: string | null) => {
    if (!createdAt) return false;

    const createdAtTime = new Date(createdAt).getTime();
    if (Number.isNaN(createdAtTime)) return false;

    return Date.now() - createdAtTime <= NEW_BADGE_DAYS * 24 * 60 * 60 * 1000;
}

interface ProductInfoProps {
    product: CategoryProduct
    categoryLabel?: string
    onReviewsClick?: () => void;
    onVariantChange?: (variant?: VariantOption) => void;
    reviewSummary?: ProductReviewSummary;
}

type VariantOption = NonNullable<CategoryProduct['variants']>[number];
type SizeChoice = {
    key: string;
    label: string;
    meta: string;
    variant?: VariantOption;
    groupVariants?: VariantOption[];
};
type ShareOption =
    | {
        id: string;
        label: string;
        action: () => void;
        iconSrc: string;
    }
    | {
        id: string;
        label: string;
        action: () => void;
        icon: typeof Link2;
    };

const hasShareIconSrc = (item: ShareOption): item is Extract<ShareOption, { iconSrc: string }> => 'iconSrc' in item;

const buildVariantGroupKey = (variant: VariantOption, index: number) => {
    const sku = (variant.sku ?? '').trim();
    if (sku) return `sku:${sku}`;
    if (typeof variant.id === 'number') return `id:${variant.id}`;
    return `row:${index}`;
};

const normalizeVariantLabel = (value?: string | null) => (value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();

const normalizeSkuSegment = (value?: string | null) =>
    (value ?? '')
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'COLOR';

const stripVariantColorSuffix = (sku?: string | null, colorName?: string | null) => {
    const normalizedSku = (sku ?? '').trim();
    const normalizedColorSegment = normalizeSkuSegment(colorName);

    if (!normalizedSku || !normalizedColorSegment) return normalizedSku;

    const suffix = `-${normalizedColorSegment}`;
    return normalizedSku.toUpperCase().endsWith(suffix)
        ? normalizedSku.slice(0, -suffix.length)
        : normalizedSku;
};

const getVariantCoreGroupKey = (variant: VariantOption) => [
    normalizeVariantLabel(variant.name),
    normalizeVariantLabel(variant.style),
    normalizeVariantLabel(variant.size),
    String(variant.width ?? ''),
    String(variant.dimension ?? ''),
    String(variant.height ?? ''),
    String(variant.priceSrp ?? ''),
    String(variant.priceDp ?? ''),
    String(variant.priceMember ?? ''),
    String(variant.prodpv ?? ''),
    String(variant.qty ?? ''),
    String(variant.status ?? ''),
    variant.images?.filter(Boolean).join('|') ?? '',
].join('|');

const looksLikeHtml = (value: string) => /<[^>]+>/.test(value);

const stripHtml = (value: string) =>
    value
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();

const toPositiveNumber = (value: unknown): number | undefined => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const getEffectiveVariantStock = (variants?: CategoryProduct['variants']) => {
    const activeVariants = (variants ?? []).filter((variant) => (variant?.status ?? 1) === 1);

    if (activeVariants.length === 0) {
        return undefined;
    }

    return activeVariants.reduce((total, variant) => total + Number(variant?.qty ?? 0), 0);
};

const buildVariantTitleParts = (variant?: NonNullable<CategoryProduct['variants']>[number]) => {
    const seen = new Set<string>();

    return [
        variant?.name?.trim(),
        variant?.style?.trim(),
        variant?.size?.trim(),
    ].filter((part): part is string => {
        if (!part) return false;
        const normalized = part.toLowerCase();
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
    });
};

const ProductInfo = ({ product, categoryLabel, onReviewsClick, onVariantChange, reviewSummary }: ProductInfoProps) => {
    const { addToCart } = useCart();
    const { data: session } = useSession();
    const isLoggedIn = Boolean(session?.user);
    const { data: me } = useMeQuery(undefined, { skip: !isLoggedIn });
    const canUseMemberPrice = isLoggedIn;
    const basePv = toPositiveNumber(product.prodpv) ?? 0;
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('');
    const [added, setAdded] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [wishlisted, setWishlisted] = useState(false);
    const [buyOptionsOpen, setBuyOptionsOpen] = useState(false);
    const [paymentLogoMissing, setPaymentLogoMissing] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [shareCopied, setShareCopied] = useState(false);
    const optionLabels = useMemo(() => extractVariantOptionLabels(product.specifications), [product.specifications]);

    const variantOptions = useMemo(
        () =>
            (product.variants ?? []).filter((variant) =>
                Boolean(
                    variant.color ||
                    variant.style ||
                    variant.size ||
                    variant.sku ||
                    (variant.images && variant.images.length > 0) ||
                    typeof variant.priceMember === 'number' ||
                    typeof variant.priceDp === 'number' ||
                    typeof variant.priceSrp === 'number',
                ),
            ),
        [product.variants],
    );

    const colorOptions = useMemo(() => {
        const map = new Map<string, string | undefined>();
        variantOptions.forEach((variant) => {
            if (!variant.color) return;
            map.set(variant.color, variant.colorHex);
        });
        return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
    }, [variantOptions]);

    const variantNameOptions = useMemo(() => {
        const map = new Map<string, string | undefined>();
        variantOptions.forEach((variant) => {
            const variantName = variant.name?.trim();
            if (!variantName) return;
            map.set(variantName, variant.images?.[0]);
        });
        return Array.from(map.entries()).map(([name, image]) => ({ name, image }));
    }, [variantOptions]);

    const groupedVariantChoices = useMemo(() => {
        const groupedSkuCounts = variantOptions.reduce((map, variant) => {
            const groupKey = `${getVariantCoreGroupKey(variant)}|${stripVariantColorSuffix(variant.sku, variant.color)}`;
            map.set(groupKey, (map.get(groupKey) ?? 0) + 1);
            return map;
        }, new Map<string, number>());

        const grouped = variantOptions.reduce((map, variant, index) => {
            const coreKey = getVariantCoreGroupKey(variant);
            const strippedSku = stripVariantColorSuffix(variant.sku, variant.color);
            const candidateKey = `${coreKey}|${strippedSku}`;
            const resolvedSku = (groupedSkuCounts.get(candidateKey) ?? 0) > 1
                ? strippedSku
                : (variant.sku ?? '').trim();
            const groupKey = `${coreKey}|${resolvedSku || buildVariantGroupKey(variant, index)}`;
            const existing = map.get(groupKey);

            if (existing) {
                existing.groupVariants = [...(existing.groupVariants ?? []), variant];
                return map;
            }

            const sizeLabel = (variant.size ?? '').trim();
            const dimensionParts = [
                variant.width ? `W ${variant.width}` : '',
                variant.dimension ? `D ${variant.dimension}` : '',
                variant.height ? `H ${variant.height}` : '',
            ].filter(Boolean);

            const metaParts = [
                (variant.name ?? '').trim(),
                (variant.style ?? '').trim(),
                dimensionParts.length > 0 ? `${dimensionParts.join(' x ')} cm` : '',
            ].filter((part) => part && part !== sizeLabel);

            map.set(groupKey, {
                key: groupKey,
                label: sizeLabel || (variant.name ?? '').trim() || `Variant ${index + 1}`,
                meta: metaParts.join(' • '),
                groupVariants: [variant],
            });

            return map;
        }, new Map<string, SizeChoice>());

        return Array.from(grouped.values());
    }, [variantOptions]);

    const sizeChoices = useMemo(() => {
        return variantOptions.flatMap((variant, index) => {
            const sizeLabel = (variant.size ?? '').trim();
            if (!sizeLabel) return [];

            const dimensionParts = [
                variant.width ? `W ${variant.width}` : '',
                variant.dimension ? `D ${variant.dimension}` : '',
                variant.height ? `H ${variant.height}` : '',
            ].filter(Boolean);

            const metaParts = [
                (variant.name ?? '').trim(),
                (variant.style ?? '').trim(),
                variant.color ? displayColorName(variant.color) : '',
                dimensionParts.length > 0 ? `${dimensionParts.join(' x ')} cm` : '',
            ].filter((part) => part && part !== sizeLabel);

            return [{
                key: buildVariantGroupKey(variant, index),
                label: sizeLabel,
                meta: metaParts.join(' • '),
                variant,
            } satisfies SizeChoice];
        });
    }, [variantOptions]);

    const logicalSizeChoices = useMemo(() => {
        return groupedVariantChoices.filter((choice) =>
            Boolean(choice.groupVariants?.some((variant) => (variant.size ?? '').trim())),
        );
    }, [groupedVariantChoices]);

    const [selectedVariantName, setSelectedVariantName] = useState('');
    const [selectedSizeKey, setSelectedSizeKey] = useState('');
    const effectiveSelectedColor = selectedColor || colorOptions[0]?.name || '';
    const hasColorSelector = colorOptions.length > 0;
    const hasPrimaryOptionSelector = variantNameOptions.length > 1;
    const showNewBadge = isNewProduct(product.createdAt);
    const effectiveSelectedPrimaryName = selectedVariantName || (hasPrimaryOptionSelector ? variantNameOptions[0]?.name || '' : '');
    const displayedStyleOptions = useMemo(() => {
        let filteredVariants = variantOptions;

        if (hasColorSelector && effectiveSelectedColor) {
            filteredVariants = filteredVariants.filter((variant) => !variant.color || variant.color === effectiveSelectedColor);
        }

        if (hasPrimaryOptionSelector && effectiveSelectedPrimaryName) {
            filteredVariants = filteredVariants.filter((variant) => (variant.name ?? '').trim() === effectiveSelectedPrimaryName);
        }

        const map = new Map<string, string | undefined>();
        filteredVariants.forEach((variant) => {
            const styleName = variant.style?.trim();
            if (!styleName) return;
            map.set(styleName, variant.images?.[0]);
        });

        return Array.from(map.entries()).map(([name, image]) => ({ name, image }));
    }, [effectiveSelectedColor, effectiveSelectedPrimaryName, hasColorSelector, hasPrimaryOptionSelector, variantOptions]);
    const hasStyleSelector = displayedStyleOptions.length > 0;
    const effectiveSelectedStyle = displayedStyleOptions.some((option) => option.name === selectedStyle)
        ? selectedStyle
        : (displayedStyleOptions[0]?.name || '');
    const primaryOptionLabel = optionLabels.primaryLabel?.trim() || 'Options';
    const hasSecondarySizeValues = logicalSizeChoices.length > 0;
    const secondaryOptionLabel = optionLabels.secondaryLabel?.trim() || (hasSecondarySizeValues ? 'Size' : '');
    const displayedSizeChoices = useMemo(() => {
        let filteredChoices = logicalSizeChoices;
        if (hasColorSelector && effectiveSelectedColor) {
            filteredChoices = logicalSizeChoices.filter((choice) =>
                (choice.groupVariants ?? []).some((variant) => !variant.color || variant.color === effectiveSelectedColor),
            );
        }
        if (hasPrimaryOptionSelector && effectiveSelectedPrimaryName) {
            filteredChoices = filteredChoices.filter((choice) =>
                (choice.groupVariants ?? []).some((variant) => (variant.name ?? '').trim() === effectiveSelectedPrimaryName),
            );
        }
        if (hasStyleSelector && effectiveSelectedStyle) {
            filteredChoices = filteredChoices.filter((choice) =>
                (choice.groupVariants ?? []).some((variant) => (variant.style ?? '').trim() === effectiveSelectedStyle),
            );
        }
        return filteredChoices;
    }, [effectiveSelectedColor, effectiveSelectedPrimaryName, effectiveSelectedStyle, hasColorSelector, hasPrimaryOptionSelector, hasStyleSelector, logicalSizeChoices]);
    const shouldShowSecondaryOption = secondaryOptionLabel.length > 0 && displayedSizeChoices.length > 0;
    const effectiveSelectedSizeKey = selectedSizeKey || displayedSizeChoices[0]?.key || '';
    const effectiveSelectedSize = selectedSize || displayedSizeChoices[0]?.label || '';

    const selectedVariant = useMemo(() => {
        if (variantOptions.length === 0) return undefined;
        const selectedSizeChoice = displayedSizeChoices.find((choice) => choice.key === effectiveSelectedSizeKey);
        if (selectedSizeChoice) {
            const groupedVariants = selectedSizeChoice.groupVariants ?? (selectedSizeChoice.variant ? [selectedSizeChoice.variant] : []);
            return (
                groupedVariants.find((variant) =>
                    (!hasColorSelector || !effectiveSelectedColor || variant.color === effectiveSelectedColor) &&
                    (!hasPrimaryOptionSelector || !effectiveSelectedPrimaryName || (variant.name ?? '').trim() === effectiveSelectedPrimaryName) &&
                    (!hasStyleSelector || !effectiveSelectedStyle || (variant.style ?? '').trim() === effectiveSelectedStyle),
                )
                ?? groupedVariants.find((variant) =>
                    (!hasColorSelector || !effectiveSelectedColor || variant.color === effectiveSelectedColor) &&
                    (!hasStyleSelector || !effectiveSelectedStyle || (variant.style ?? '').trim() === effectiveSelectedStyle),
                )
                ?? groupedVariants.find((variant) =>
                    (!hasPrimaryOptionSelector || !effectiveSelectedPrimaryName || (variant.name ?? '').trim() === effectiveSelectedPrimaryName) &&
                    (!hasStyleSelector || !effectiveSelectedStyle || (variant.style ?? '').trim() === effectiveSelectedStyle),
                )
                ?? groupedVariants[0]
            );
        }
        if (hasColorSelector && effectiveSelectedColor && hasPrimaryOptionSelector && effectiveSelectedPrimaryName && hasStyleSelector && effectiveSelectedStyle) {
            return (
                variantOptions.find((variant) =>
                    variant.color === effectiveSelectedColor &&
                    (variant.name ?? '').trim() === effectiveSelectedPrimaryName &&
                    (variant.style ?? '').trim() === effectiveSelectedStyle,
                )
                ?? variantOptions.find((variant) =>
                    variant.color === effectiveSelectedColor && (variant.style ?? '').trim() === effectiveSelectedStyle,
                )
                ?? variantOptions.find((variant) => variant.color === effectiveSelectedColor)
                ?? variantOptions.find((variant) => (variant.style ?? '').trim() === effectiveSelectedStyle)
                ?? variantOptions.find((variant) => (variant.name ?? '').trim() === effectiveSelectedPrimaryName)
                ?? variantOptions[0]
            );
        }
        if (hasStyleSelector && effectiveSelectedStyle && hasPrimaryOptionSelector && effectiveSelectedPrimaryName) {
            return (
                variantOptions.find((variant) =>
                    (variant.style ?? '').trim() === effectiveSelectedStyle &&
                    (variant.name ?? '').trim() === effectiveSelectedPrimaryName,
                )
                ?? variantOptions.find((variant) => (variant.style ?? '').trim() === effectiveSelectedStyle)
                ?? variantOptions.find((variant) => (variant.name ?? '').trim() === effectiveSelectedPrimaryName)
                ?? variantOptions[0]
            );
        }
        if (hasPrimaryOptionSelector && effectiveSelectedPrimaryName) {
            return (
                variantOptions.find((variant) =>
                    (variant.name ?? '').trim() === effectiveSelectedPrimaryName &&
                    (!hasStyleSelector || !effectiveSelectedStyle || (variant.style ?? '').trim() === effectiveSelectedStyle),
                )
                ?? (hasStyleSelector && effectiveSelectedStyle
                    ? variantOptions.find((variant) => (variant.style ?? '').trim() === effectiveSelectedStyle)
                    : undefined)
                ?? variantOptions[0]
            );
        }
        if (hasStyleSelector && effectiveSelectedStyle) {
            return variantOptions.find((variant) => (variant.style ?? '').trim() === effectiveSelectedStyle) ?? variantOptions[0];
        }
        if (hasColorSelector && effectiveSelectedColor) {
            return variantOptions.find((variant) => variant.color === effectiveSelectedColor) ?? variantOptions[0];
        }
        return (
            variantOptions.find((variant) =>
                variant.color === effectiveSelectedColor &&
                (((variant.size ?? '').trim() === effectiveSelectedSize) || ((variant.name ?? '').trim() === effectiveSelectedSize))
            )
            ?? variantOptions.find((variant) => variant.color === effectiveSelectedColor)
            ?? variantOptions.find((variant) =>
                ((variant.size ?? '').trim() === selectedSize) || ((variant.name ?? '').trim() === selectedSize)
            )
            ?? variantOptions[0]
        );
    }, [displayedSizeChoices, variantOptions, effectiveSelectedColor, effectiveSelectedPrimaryName, effectiveSelectedSize, effectiveSelectedSizeKey, effectiveSelectedStyle, hasColorSelector, hasPrimaryOptionSelector, hasStyleSelector, selectedSize]);

    useEffect(() => {
        onVariantChange?.(selectedVariant);
    }, [selectedVariant, onVariantChange]);

    const baseSrp = toPositiveNumber(product.originalPrice) ?? toPositiveNumber(product.price) ?? 0;
    const variantSrp = toPositiveNumber(selectedVariant?.priceSrp) ?? baseSrp;
    const variantMember = toPositiveNumber(selectedVariant?.priceMember) ?? toPositiveNumber(product.priceMember) ?? 0;
    const hasMemberPrice = variantMember > 0 && variantMember < variantSrp;

    const displayPrice = canUseMemberPrice && hasMemberPrice ? variantMember : variantSrp;
    const displayOriginalPrice = canUseMemberPrice
        ? (hasMemberPrice ? variantSrp : undefined)
        : (product.originalPrice && product.originalPrice > variantSrp ? product.originalPrice : undefined);
    const totalVariantStock = getEffectiveVariantStock(variantOptions);
    const displayStock = typeof selectedVariant?.qty === 'number'
        ? selectedVariant.qty
        : (typeof totalVariantStock === 'number' ? totalVariantStock : product.stock);
    const productType = Number(product.type ?? 0);
    const isVariantProduct = productType === 1;
    const hasRealVariants = isVariantProduct && variantOptions.length > 0;
    const variantPv = hasRealVariants
        ? (toPositiveNumber(selectedVariant?.prodpv) ?? 0)
        : basePv;
    const productTypeLabel = PRODUCT_TYPE_LABELS[productType] ?? 'Regular';
    const displaySku = (selectedVariant?.sku && selectedVariant.sku.trim().length > 0)
        ? selectedVariant.sku
        : (product.sku && product.sku.trim().length > 0 ? product.sku : '');
    const displayWidth = toPositiveNumber(selectedVariant?.width) ?? toPositiveNumber(product.pswidth);
    const displayDimension = toPositiveNumber(selectedVariant?.dimension) ?? toPositiveNumber(product.pslenght);
    const displayHeight = toPositiveNumber(selectedVariant?.height) ?? toPositiveNumber(product.psheight);
    const hasDisplayDimensions = Boolean(displayWidth || displayDimension || displayHeight);
    const selectedVariantImage = selectedVariant?.images?.find((image) => typeof image === 'string' && image.trim().length > 0);
    const selectedVariantLabel = selectedVariant?.name?.trim() || selectedVariant?.style?.trim() || selectedVariant?.size?.trim() || '';
    const selectedVariantTitleParts = buildVariantTitleParts(selectedVariant);
    const displayTitle = selectedVariantTitleParts.length > 0
        ? `${product.name} - ${selectedVariantTitleParts.join(' - ')}`
        : product.name;
    const isInStock = typeof displayStock !== 'number' || displayStock > 0;
    const productDescription = (product.description ?? '').trim();
    const plainDescription = productDescription ? stripHtml(productDescription) : '';


    const reviewCount = reviewSummary?.count ?? 0;
    const avgRatingValue = typeof reviewSummary?.average === 'number' ? reviewSummary.average : 0;
    const avgRating = avgRatingValue.toFixed(1);

    const handleAddToCart = () => {
        if (!isInStock) return;

        const variantLabel = [
            selectedVariant?.name?.trim(),
            selectedVariant?.style?.trim(),
            selectedVariant?.size?.trim(),
            selectedVariant?.color ? displayColorName(selectedVariant.color) : '',
        ].filter(Boolean).join(' • ');
        const cartItemIdBase = product.id ? String(product.id) : product.name.toLocaleLowerCase().replace(/\s+/g, '-');
        const cartItemId = selectedVariant?.sku ? `${cartItemIdBase}::${selectedVariant.sku}` : cartItemIdBase;

        for (let i = 0; i < quantity; i++) {
            addToCart({
                id: cartItemId,
                name: variantLabel ? `${product.name} (${variantLabel})` : product.name,
                price: displayPrice,
                originalPrice: displayOriginalPrice ?? null,
                image: selectedVariantImage || product.image,
                prodpv: variantPv,
                brand: product.brand ?? null,
                selectedColor: selectedVariant?.color ?? null,
                selectedStyle: selectedVariant?.style ?? null,
                selectedSize: selectedVariant?.size ?? null,
                selectedType: selectedVariant?.name ?? null,
                selectedSku: selectedVariant?.sku ?? product.sku ?? null,
            });
        }
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);

    };

    const referralCode = (me?.username ?? '').trim();
    const shareUrl = useMemo(() => {
        const baseUrl = 'https://www.afhome.ph/shop';
        if (!referralCode) return baseUrl;
        return `${baseUrl}?ref=${encodeURIComponent(referralCode)}`;
    }, [referralCode]);

    useEffect(() => {
        if (!isShareOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsShareOpen(false);
        };
        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [isShareOpen]);

    const handleCopyShareLink = async () => {
        const url = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
        if (!url) return;
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
            } else {
                const fallback = document.createElement('textarea');
                fallback.value = url;
                fallback.style.position = 'fixed';
                fallback.style.opacity = '0';
                document.body.appendChild(fallback);
                fallback.focus();
                fallback.select();
                document.execCommand('copy');
                document.body.removeChild(fallback);
            }
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2000);
        } catch {
            setShareCopied(false);
        }
    };

    const handleShareExternal = (type: 'messenger' | 'whatsapp' | 'x' | 'telegram' | 'viber') => {
        const url = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
        const title = displayTitle || product.name;
        if (!url) return;

        const encodedUrl = encodeURIComponent(url);
        const encodedText = encodeURIComponent(`${title} - ${url}`);
        const shareTargets: Record<string, string> = {
            messenger: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            whatsapp: `https://wa.me/?text=${encodedText}`,
            x: `https://twitter.com/intent/tweet?text=${encodedText}`,
            telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
            viber: `viber://forward?text=${encodedText}`,
        };
        const targetUrl = shareTargets[type];
        if (targetUrl) window.open(targetUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
        >
            {/* Header Section */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    {product.brand && (
                        <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">{product.brand}</span>
                    )}
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mt-1">{displayTitle}</h1>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <motion.button
                        onClick={() => setWishlisted(w => !w)}
                        whileTap={{ scale: 0.8 }}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            wishlisted 
                                ? 'border-orange-200 text-orange-500' 
                                : 'border-gray-200 text-gray-400 hover:border-orange-200 hover:text-orange-500'
                        }`}
                        title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <HeartIcon filled={wishlisted} />
                    </motion.button>
                    <button
                        className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:border-orange-200 hover:text-orange-500 transition-all cursor-pointer"
                        onClick={() => setIsShareOpen(true)}
                        type="button"
                    >
                        <ShareIcon />
                    </button>
                </div>
            </div>
            {/* Rating & Badges */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <StarRating rating={Math.round(avgRatingValue)} size={16} />
                    <span className="text-sm font-bold text-slate-700">{avgRating}</span>
                    <button
                        onClick={() => onReviewsClick?.()}
                        className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                    >
                        ({reviewCount} review{reviewCount === 1 ? '' : 's'})
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    {product.verified !== false && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-green-200 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                            ✓ Verified
                        </span>
                    )}
                    {showNewBadge && (
                        <span className="rounded-full border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                            New
                        </span>
                    )}
                    {categoryLabel && (
                        <span className="rounded-full border border-orange-200 px-2.5 py-1 text-[11px] font-semibold text-orange-600">
                            {categoryLabel}
                        </span>
                    )}
                </div>
            </div>
            {/* Product Badges */}
            {(product.musthave || product.bestseller || product.salespromo) && (
                <div className="flex flex-wrap gap-2">
                    {product.musthave && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700">
                            ★ Must Have
                        </span>
                    )}
                    {product.bestseller && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700">
                            🔥 Best Seller
                        </span>
                    )}
                    {product.salespromo && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700">
                            🏷 On Sale
                        </span>
                    )}
                </div>
            )}

            {/* Price Section */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
                <div className="flex items-baseline gap-3 flex-wrap mb-3">
                    <span className="text-3xl sm:text-4xl font-bold text-orange-600">₱{displayPrice.toLocaleString()}</span>
                    {displayOriginalPrice && (
                        <>
                            <span className="text-lg text-gray-400 line-through">₱{displayOriginalPrice.toLocaleString()}</span>
                            <span className="text-sm font-semibold text-green-600 border border-green-200 px-3 py-1 rounded-full">
                                Save ₱{(displayOriginalPrice - displayPrice).toLocaleString()}
                            </span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {canUseMemberPrice && hasMemberPrice && (
                        <span className="inline-flex items-center rounded-full border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                            ✓ Member Price Applied
                        </span>
                    )}
                    {variantPv > 0 && (
                        <span className="inline-flex items-center rounded-full border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
                            PV {variantPv.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>

            {/* Product Details */}
            <div className="rounded-2xl border border-gray-200 p-4 space-y-3">
                {(displaySku || typeof displayStock === 'number') && (
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        {displaySku && (
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500">SKU:</span>
                                <span className="font-semibold text-slate-800">{displaySku}</span>
                            </div>
                        )}
                        {typeof displayStock === 'number' && (
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500">Stock:</span>
                                <span className="font-semibold text-slate-800">{displayStock}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500">Type:</span>
                            <span className="font-semibold text-orange-500">{productTypeLabel}</span>
                        </div>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full border ${isInStock ? 'border-green-500 bg-green-500 animate-pulse' : 'border-red-400 bg-red-400'}`} />
                    <span className={`text-sm font-semibold ${isInStock ? 'text-green-600' : 'text-red-500'}`}>
                        {isInStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    {isInStock && typeof displayStock === 'number' && displayStock <= 10 && (
                        <span className="text-sm text-orange-600 font-medium">Only {displayStock} left</span>
                    )}
                </div>
            </div>

            {/* Variant Selection */}
            {hasRealVariants && (
                <div className="space-y-4">
                    {selectedVariantLabel || hasDisplayDimensions || selectedVariantImage ? (
                        <div className="flex items-center gap-3 rounded-xl border border-orange-200 p-3">
                            {selectedVariantImage ? (
                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-orange-200">
                                    <Image
                                        src={selectedVariantImage}
                                        alt={selectedVariantLabel || product.name}
                                        fill
                                        className="object-cover"
                                        sizes="48px"
                                    />
                                </div>
                            ) : null}
                            <div className="flex min-w-0 flex-col gap-1">
                                {selectedVariantLabel && (
                                    <span className="text-sm font-semibold text-slate-700">
                                        Selected: <span className="text-orange-600">{selectedVariantLabel}</span>
                                    </span>
                                )}
                                {hasDisplayDimensions && (
                                    <span className="text-xs text-slate-600">
                                        {displayWidth ? `W ${displayWidth} cm` : 'W -'} × {displayDimension ? `D ${displayDimension} cm` : 'D -'} × {displayHeight ? `H ${displayHeight} cm` : 'H -'}
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {hasColorSelector && colorOptions.length > 0 && (
                        <div>
                            <span className="text-sm font-semibold text-slate-700 mb-2 block">Color</span>
                            <div className="flex gap-2">
                                {colorOptions.map(c => (
                                    <button
                                        key={c.name}
                                        title={c.name}
                                        onClick={() => setSelectedColor(c.name)}
                                        className={`w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-all duration-200 ${
                                            effectiveSelectedColor === c.name ? 'ring-2 ring-orange-400 ring-offset-2' : ''
                                        }`}
                                        style={{ backgroundColor: c.hex ?? '#E5E7EB' }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {hasPrimaryOptionSelector && variantNameOptions.length > 0 && (
                        <div>
                            <span className="text-sm font-semibold text-slate-700 mb-2 block">{primaryOptionLabel}</span>
                            <div className="grid grid-cols-2 gap-2">
                                {variantNameOptions.map((variantOption) => (
                                    <button
                                        key={variantOption.name}
                                        onClick={() => setSelectedVariantName(variantOption.name)}
                                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border-2 font-medium transition-all ${
                                            effectiveSelectedPrimaryName === variantOption.name
                                                ? 'border-orange-400 text-orange-600'
                                                : 'border-gray-200 text-slate-600 hover:border-orange-200'
                                        }`}
                                    >
                                        {variantOption.image && (
                                            <span className="relative h-8 w-8 overflow-hidden rounded border border-gray-200 shrink-0">
                                                <Image
                                                    src={variantOption.image}
                                                    alt={variantOption.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="32px"
                                                />
                                            </span>
                                        )}
                                        <span className="truncate">{variantOption.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {shouldShowSecondaryOption && (
                        <div>
                            <span className="text-sm font-semibold text-slate-700 mb-2 block">{secondaryOptionLabel}</span>
                            <div className="grid grid-cols-2 gap-2">
                                {displayedSizeChoices.map((sizeChoice) => (
                                    <button
                                        key={sizeChoice.key}
                                        onClick={() => {
                                            setSelectedSize(sizeChoice.label);
                                            setSelectedSizeKey(sizeChoice.key);
                                        }}
                                        className={`rounded-lg border-2 px-3 py-2 text-left transition-all ${
                                            effectiveSelectedSizeKey === sizeChoice.key
                                                ? 'border-orange-400 text-orange-600'
                                                : 'border-gray-200 text-slate-600 hover:border-orange-200'
                                        }`}
                                    >
                                        <span className="block text-sm font-medium">{sizeChoice.label}</span>
                                        {sizeChoice.meta && (
                                            <span className="mt-1 block text-[11px] text-slate-400">
                                                {sizeChoice.meta}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Shipping & Payment Info */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-5 space-y-4">
                <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Shipping & Delivery</h4>
                    <div className="space-y-2">
                        {[
                            { icon: '📦', text: 'Ships within 1–3 business days' },
                            { icon: '🏙️', text: 'Nationwide delivery via LBC / J&T' },
                            { icon: '✅', text: 'Free assembly for Metro Manila orders' },
                        ].map(item => (
                            <div key={item.text} className="flex items-center gap-3 text-sm text-gray-600">
                                <span className="text-base">{item.icon}</span>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs text-gray-500 mb-3 font-medium">We accept:</p>
                    <div className="flex items-center">
                        {!paymentLogoMissing ? (
                            <img
                                src="/Images/paymentsLogo/paymentsLogo.png"
                                alt="Supported payment methods"
                                className="h-8 md:h-10 w-auto"
                                loading="lazy"
                                decoding="async"
                                onError={() => setPaymentLogoMissing(true)}
                            />
                        ) : (
                            <div className="flex items-center gap-2 flex-wrap">
                                {[
                                    { src: '/payment-logos/gcash.svg', alt: 'GCash' },
                                    { src: '/payment-logos/maya.svg', alt: 'Maya' },
                                    { src: '/payment-logos/visa.svg', alt: 'Visa' },
                                    { src: '/payment-logos/mastercard.svg', alt: 'Mastercard' },
                                    { src: '/payment-logos/bpi.svg', alt: 'BPI' },
                                    { src: '/payment-logos/bdo.svg', alt: 'BDO' },
                                    { src: '/payment-logos/landbank.svg', alt: 'LandBank' },
                                    { src: '/payment-logos/unionbank.svg', alt: 'UnionBank' },
                                ].map((payment) => (
                                    <div key={payment.alt} className="h-8">
                                        <img
                                            src={payment.src}
                                            alt={payment.alt}
                                            className="h-8 w-auto"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-700">Quantity:</span>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button 
                            onClick={() => setQuantity(qty => Math.max(1, qty - 1))} 
                            className="px-4 py-2.5 text-gray-500 hover:text-orange-500 transition-colors text-lg font-medium"
                        >
                            −
                        </button>
                        <span className="px-5 py-2.5 text-sm font-bold text-slate-800 min-w-12 text-center border-x border-gray-200">
                            {quantity}
                        </span>
                        <button 
                            onClick={() => setQuantity(qty => qty + 1)} 
                            className="px-4 py-2.5 text-gray-500 hover:text-orange-500 transition-colors text-lg font-medium"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <OutlineButton
                        onClick={handleAddToCart}
                        disabled={!isInStock}
                        className="flex-1"
                    >
                        {added ? '✓ Added!' : <><CartIcon /> Add to Cart</>}
                    </OutlineButton>
                    <PrimaryButton
                        onClick={() => {
                            if (!isInStock) return;
                            setBuyOptionsOpen(true);
                        }}
                        disabled={!isInStock}
                        className="flex-1"
                    >
                        Buy Now
                    </PrimaryButton>
                </div>
            </div>

            <BuyNowOptionsModal
                isOpen={buyOptionsOpen}
                onClose={() => setBuyOptionsOpen(false)}
                product={product}
                quantity={quantity}
                selectedVariant={selectedVariant}
                selectedColor={effectiveSelectedColor}
                selectedStyle={selectedVariant?.style?.trim() || selectedStyle}
                selectedSize={selectedVariant?.size?.trim() || selectedSize}
                selectedType={selectedVariant?.name?.trim() || undefined}

            />

            {isShareOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:p-6">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsShareOpen(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-xl rounded-3xl shadow-2xl border border-gray-100 p-5 sm:p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Share to</p>
                                <h3 className="text-lg font-bold text-slate-800">Send this product</h3>
                            </div>
                            <button
                                onClick={() => setIsShareOpen(false)}
                                className="h-9 w-9 rounded-full border border-gray-200 text-gray-500 hover:text-orange-600 hover:border-orange-200 transition-colors"
                                type="button"
                            >
                                <span className="sr-only">Close</span>
                                <XIcon className="mx-auto" size={16} />
                            </button>
                        </div>

                        <div className="mt-5 grid grid-cols-3 sm:grid-cols-6 gap-4">
                            {(([
                                { id: 'messenger', label: 'Messenger', iconSrc: '/Images/icon_apps/messenger.png', action: () => handleShareExternal('messenger') },
                                { id: 'whatsapp', label: 'WhatsApp', iconSrc: '/Images/icon_apps/whatapps.avif', action: () => handleShareExternal('whatsapp') },
                                { id: 'x', label: 'X', iconSrc: '/Images/icon_apps/x.jpg', action: () => handleShareExternal('x') },
                                { id: 'telegram', label: 'Telegram', iconSrc: '/Images/icon_apps/telegram.png', action: () => handleShareExternal('telegram') },
                                { id: 'viber', label: 'Viber', iconSrc: '/Images/icon_apps/viber.png', action: () => handleShareExternal('viber') },
                                { id: 'copy', label: shareCopied ? 'Copied' : 'Copy link', icon: Link2, action: handleCopyShareLink },
                            ]) as ShareOption[]).map((item) => (
                                <button
                                    key={item.id}
                                    onClick={item.action}
                                    className="flex flex-col items-center gap-2 text-center text-xs font-semibold text-slate-600 hover:text-orange-600 transition-colors"
                                    type="button"
                                >
                                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 text-slate-600 shadow-sm">
                                        {hasShareIconSrc(item) ? (
                                            <Image
                                                src={item.iconSrc}
                                                alt={item.label}
                                                width={28}
                                                height={28}
                                                className="h-7 w-7 object-contain"
                                            />
                                        ) : (
                                            <item.icon size={22} />
                                        )}
                                    </span>
                                    <span className="leading-tight">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-4 rounded-2xl border border-gray-100 px-4 py-3">
                            <p className="text-xs font-semibold text-slate-500">Product share link</p>
                            <div className="mt-1 flex items-center justify-between gap-3">
                                <span className="text-xs text-slate-600 truncate">{shareUrl}</span>
                                <button
                                    onClick={handleCopyShareLink}
                                    className="text-xs font-semibold text-orange-600 hover:text-orange-700"
                                    type="button"
                                >
                                    {shareCopied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default ProductInfo;

