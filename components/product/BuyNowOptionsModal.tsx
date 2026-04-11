'use client';

import { CategoryProduct } from '@/libs/CategoryData';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import Loading from '../Loading';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type VariantOption = NonNullable<CategoryProduct['variants']>[number];

interface BuyNowOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CategoryProduct;
  quantity?: number;
  selectedVariant?: VariantOption;
  selectedColor?: string;
  selectedStyle?: string;
  selectedSize?: string;
  selectedType?: string;
}

const toPositiveNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const BuyNowOptionsModal = ({
  isOpen,
  onClose,
  product,
  quantity = 1,
  selectedVariant,
  selectedColor,
  selectedStyle,
  selectedSize,
  selectedType,
}: BuyNowOptionsModalProps) => {
  const { status } = useSession();
  const [notice, setNotice] = useState('');
  const [variantPickerOpen, setVariantPickerOpen] = useState(false);
  const [modalSelectedVariantSku, setModalSelectedVariantSku] = useState(selectedVariant?.sku ?? '');
  const loading = false;
  const router = useRouter();

  const variantOptions = useMemo(
    () =>
      (product.variants ?? []).filter((variant) =>
        Boolean(
          variant.color ||
          variant.style ||
          variant.size ||
          variant.name ||
          variant.sku ||
          (variant.images && variant.images.length > 0) ||
          typeof variant.priceSrp === 'number',
        ),
      ),
    [product.variants],
  );

  const hasVariantOptions = variantOptions.length > 0;
  const effectiveVariantSku = variantPickerOpen
    ? (modalSelectedVariantSku || selectedVariant?.sku || '')
    : (selectedVariant?.sku || modalSelectedVariantSku || '');

  const activeVariant = useMemo(() => {
    if (!hasVariantOptions) return undefined;
    if (effectiveVariantSku) {
      return variantOptions.find((variant) => (variant.sku ?? '') === effectiveVariantSku) ?? selectedVariant ?? variantOptions[0];
    }
    return selectedVariant ?? variantOptions[0];
  }, [effectiveVariantSku, hasVariantOptions, selectedVariant, variantOptions]);

  const activeSelectedColor = activeVariant?.color ?? selectedColor ?? null;
  const activeSelectedStyle = activeVariant?.style ?? selectedStyle ?? null;
  const activeSelectedSize = activeVariant?.size ?? selectedSize ?? null;
  const activeSelectedType = activeVariant?.name ?? selectedType ?? null;
  const unitPrice = toPositiveNumber(activeVariant?.priceSrp) ?? product.price;
  const unitPv = toPositiveNumber(activeVariant?.prodpv) ?? Number(product.prodpv ?? 0);
  const selectedVariantImage = activeVariant?.images?.[0] || product.image;

  const subtotal = useMemo(() => unitPrice * quantity, [quantity, unitPrice]);
  const totalPv = useMemo(() => unitPv * quantity, [unitPv, quantity]);
  const handlingFee = 0;
  const total = subtotal + handlingFee;

  const handleClose = () => {
    setNotice('');
    setVariantPickerOpen(false);
    setModalSelectedVariantSku('');
    onClose();
  };

  const persistCheckoutDraft = () => {
    localStorage.setItem('guest_checkout', JSON.stringify({
      product: {
        ...product,
        image: selectedVariantImage,
        sku: activeVariant?.sku ?? product.sku,
        price: unitPrice,
        prodpv: activeVariant?.prodpv ?? product.prodpv,
      },
      quantity,
      selectedColor: activeSelectedColor,
      selectedStyle: activeSelectedStyle,
      selectedSize: activeSelectedSize,
      selectedType: activeSelectedType,
      selectedSku: activeVariant?.sku ?? null,
      subtotal,
      handlingFee,
      total,
    }));
  };

  const ensureVariantReady = () => {
    if (hasVariantOptions && !activeVariant) {
      setNotice('Please select a variant before continuing to checkout.');
      setVariantPickerOpen(true);
      return false;
    }

    return true;
  };

  const handleProceed = async () => {
    if (!ensureVariantReady()) return;

    if (status !== 'authenticated') {
      handleClose();
      router.push('/login');
      return;
    }

    persistCheckoutDraft();
    handleClose();
    router.push('/checkout/customer');
  };

  const handleCustomerCheckout = () => {
    if (!ensureVariantReady()) return;

    persistCheckoutDraft();
    handleClose();
    router.push('/checkout/customer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-3 sm:items-center sm:p-6"
          >
            <div
              className="mx-auto max-h-[calc(100vh-1.5rem)] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl sm:max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/25 bg-white/15 shrink-0">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-orange-100">AF Home · Secure Checkout</p>
                    <h2 className="text-lg font-bold leading-tight text-white">Review Before Checkout</h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/25"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5">
                <div className="border-b border-slate-100 bg-gradient-to-b from-orange-50/50 to-white p-5 sm:p-6 lg:col-span-2 lg:border-b-0 lg:border-r">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Order Summary</p>

                  <div className="flex gap-3.5 rounded-2xl border border-orange-100 bg-white p-3.5 shadow-sm">
                    <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                      <Image src={selectedVariantImage} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-bold leading-snug text-slate-800">{product.name}</p>
                      <p className="mt-1.5 text-[15px] font-extrabold text-orange-500">P{unitPrice.toLocaleString()}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1">
                        <span className="rounded-full border border-orange-100 bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-600">
                          Qty: {quantity}
                        </span>
                        {activeSelectedColor ? <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{activeSelectedColor}</span> : null}
                        {activeSelectedStyle ? <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{activeSelectedStyle}</span> : null}
                        {activeSelectedSize ? <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{activeSelectedSize}</span> : null}
                      </div>
                    </div>
                  </div>

                  {activeSelectedType ? (
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3.5 py-2 text-xs">
                      <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-slate-500">Type:</span>
                      <span className="font-semibold text-slate-700">{activeSelectedType}</span>
                    </div>
                  ) : null}

                  <div className="mt-3 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
                    <div className="space-y-3 px-4 py-4">
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
                        <span className="font-semibold text-slate-700">P{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>PV per item</span>
                        <span className="font-semibold text-blue-600">{unitPv.toLocaleString()} PV</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>Total PV</span>
                        <span className="font-semibold text-blue-600">{totalPv.toLocaleString()} PV</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>Shipping fee</span>
                        <span className={handlingFee === 0 ? 'font-semibold text-green-600' : 'font-semibold text-slate-700'}>
                          {handlingFee === 0 ? 'P0.00' : `P${handlingFee}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-orange-100 bg-orange-50 px-4 py-3">
                      <span className="text-sm font-bold text-slate-800">Total Amount</span>
                      <span className="text-xl font-extrabold text-orange-500">P{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-3 py-2">
                    <svg className="h-3.5 w-3.5 shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs font-medium text-green-700">Shipping fee is temporarily set to P0.00 for checkout testing.</p>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                    {[
                      { label: 'SSL Encrypted', icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
                      { label: 'PayMongo', icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
                      { label: '3DS Secure', icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
                    ].map((badge) => (
                      <div key={badge.label} className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-2">
                        <span className="text-slate-400">{badge.icon}</span>
                        <span className="text-center text-[9px] font-semibold leading-tight text-slate-400">{badge.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 sm:p-6 lg:col-span-3">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Checkout Preview</p>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                    <p className="text-xs font-bold text-slate-700">Payment options will be selected on the checkout page.</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                      We removed payment selection from this modal so the final checkout page can handle address, vouchers, and payment method in one place.
                    </p>
                  </div>

                  <AnimatePresence>
                    {hasVariantOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 rounded-2xl border border-orange-200 bg-orange-50/70 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="flex items-center gap-1.5 text-xs font-bold text-orange-700">
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Variant Selection
                              </p>
                              <p className="mt-1 text-[11px] text-orange-600">
                                Checkout will use the exact variant you select here.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setVariantPickerOpen((current) => !current)}
                              className="shrink-0 rounded-xl border border-orange-200 bg-white px-3 py-2 text-[11px] font-bold text-orange-600 transition-colors hover:bg-orange-100"
                            >
                              {variantPickerOpen ? 'Hide Options' : (activeVariant ? 'Change Variant' : 'Select Variant')}
                            </button>
                          </div>

                          {(activeSelectedType || activeSelectedSize || activeSelectedColor || activeVariant?.sku) ? (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {activeSelectedType ? <span className="rounded-full border border-orange-100 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-700">{activeSelectedType}</span> : null}
                              {activeSelectedSize ? <span className="rounded-full border border-orange-100 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-700">{activeSelectedSize}</span> : null}
                              {activeSelectedColor ? <span className="rounded-full border border-orange-100 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-700">{activeSelectedColor}</span> : null}
                              {activeVariant?.sku ? <span className="rounded-full border border-orange-100 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-700">{activeVariant.sku}</span> : null}
                            </div>
                          ) : null}

                          <AnimatePresence>
                            {(variantPickerOpen || !activeVariant) && (
                              <motion.div
                                initial={{ opacity: 0, y: 20, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: 12, height: 0 }}
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className="mt-3 overflow-hidden"
                              >
                                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                                  {variantOptions.map((variant, index) => {
                                    const isActive = (activeVariant?.sku ?? '') === (variant.sku ?? '');
                                    const variantLabel = variant.name?.trim() || variant.size?.trim() || `Variant ${index + 1}`;
                                    const variantMeta = [
                                      variant.size?.trim() || '',
                                      variant.color?.trim() || '',
                                      variant.sku?.trim() || '',
                                    ].filter(Boolean).join(' • ');

                                    return (
                                      <button
                                        key={`${variant.sku ?? variant.id ?? index}-${index}`}
                                        type="button"
                                        onClick={() => {
                                          setModalSelectedVariantSku(variant.sku ?? '');
                                          setVariantPickerOpen(false);
                                          setNotice('');
                                        }}
                                        className={`w-full rounded-2xl border px-3.5 py-3 text-left transition-all ${
                                          isActive
                                            ? 'border-orange-400 bg-white shadow-sm'
                                            : 'border-orange-100 bg-white/80 hover:border-orange-300 hover:bg-white'
                                        }`}
                                      >
                                        <div className="flex items-start gap-3">
                                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white">
                                            <Image
                                              src={variant.images?.[0] || selectedVariantImage}
                                              alt={variantLabel}
                                              fill
                                              className="object-cover"
                                            />
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                              <p className="truncate text-sm font-bold text-slate-800">{variantLabel}</p>
                                              {isActive ? <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">Selected</span> : null}
                                            </div>
                                            {variantMeta ? <p className="mt-1 text-[11px] text-slate-500">{variantMeta}</p> : null}
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                    <p className="mb-3 text-xs font-bold text-slate-700">What happens next?</p>
                    <div className="space-y-2.5">
                      {[
                        { n: '1', text: 'Continue to the checkout page', active: true },
                        { n: '2', text: 'Review address, voucher, and final payment option', active: false },
                        { n: '3', text: 'PayMongo processes your payment securely after checkout', active: false },
                      ].map((step) => (
                        <div key={step.n} className="flex items-start gap-3">
                          <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            step.active ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500'
                          }`}>
                            {step.n}
                          </div>
                          <p className={`text-xs leading-relaxed ${step.active ? 'font-semibold text-slate-800' : 'text-slate-400'}`}>
                            {step.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {notice ? (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
                      >
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-xs font-medium text-amber-800">{notice}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <div className="mt-4 flex flex-col gap-2.5">
                    {status !== 'authenticated' ? (
                      <>
                        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-2.5">
                            <p className="text-center text-[11px] font-bold uppercase tracking-widest text-slate-500">How would you like to checkout?</p>
                          </div>
                          <div className="grid grid-cols-2 divide-x divide-slate-200">
                            <button
                              type="button"
                              onClick={handleProceed}
                              disabled={loading}
                              className="group flex flex-col items-center gap-2 p-4 transition-all duration-200 hover:bg-orange-50 disabled:opacity-60"
                            >
                              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-md shadow-orange-100 transition-all group-hover:shadow-orange-200">
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                              {loading ? (
                                <div className="flex items-center gap-1.5">
                                  <Loading size={12} />
                                  <span className="text-[11px] font-bold text-orange-600">Processing...</span>
                                </div>
                              ) : (
                                <>
                                  <span className="text-xs font-bold text-slate-800 transition-colors group-hover:text-orange-600">Sign In & Checkout</span>
                                  <span className="text-center text-[10px] leading-tight text-slate-400">Earn PV · Track orders</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={handleCustomerCheckout}
                              className="group flex flex-col items-center gap-2 p-4 transition-all duration-200 hover:bg-blue-50"
                            >
                              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 shadow-md shadow-slate-100 transition-all group-hover:from-blue-400 group-hover:to-blue-600 group-hover:shadow-blue-100">
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <span className="text-xs font-bold text-slate-800 transition-colors group-hover:text-blue-600">Guest Checkout</span>
                              <span className="text-center text-[10px] leading-tight text-slate-400">No account needed</span>
                            </button>
                          </div>
                          <div className="flex items-center justify-between border-t border-orange-100 bg-orange-50 px-4 py-2">
                            <span className="text-[11px] font-medium text-orange-700">Order Total</span>
                            <span className="text-sm font-extrabold text-orange-600">P{total.toLocaleString()}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleClose}
                          className="rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-400 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2.5 sm:flex-row">
                        <button
                          type="button"
                          onClick={handleClose}
                          className="rounded-xl border-2 border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 sm:flex-1"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleProceed}
                          disabled={loading}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-[2]"
                        >
                          {loading ? (
                            <>
                              <Loading size={16} />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              <span>Continue to Checkout · P{total.toLocaleString()}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secured by <span className="font-semibold text-slate-500">PayMongo</span> · SSL Encrypted · PCI DSS Compliant
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BuyNowOptionsModal;
