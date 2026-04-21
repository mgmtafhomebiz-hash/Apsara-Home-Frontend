'use client';

import Loading from "@/app/loading";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import TopBar from "@/components/layout/TopBar";
import { GuestForm, FormErrors, CustomerCheckoutData, PaymentMethod, PaymentMode } from "@/types/CustomerCheckout/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import CustomerCheckoutContactForm from "./CustomerCheckoutContactForm";
import CustomerCheckoutAddressForm from "./CustomerCheckoutAddressForm";
import CustomerCheckoutPaymentMethod from "./CustomerCheckoutPaymentMethod";
import CustomerCheckoutOrderSummary from "./CustomerCheckoutOrderSummary";
import { CheckoutOnlineBankingProvider, useCreateCheckoutSessionMutation, useValidateVoucherMutation } from "@/store/api/paymentApi";
import { useGetPublicGeneralSettingsQuery } from "@/store/api/adminSettingsApi";
import { getStoredReferralCode } from "@/libs/referral";
import { useMeQuery } from "@/store/api/userApi";
import { useLazyGetPublicProductQuery } from "@/store/api/productsApi";
import type { Category } from '@/store/api/categoriesApi';
import { User, ArrowLeft } from 'lucide-react';

const defaultForm: GuestForm = {
    name: '',
    email: '',
    phone: '',
    address: '',
    region: '',
    barangay: '',
    city: '',
    province: '',
    zip: '',
    referred_by: '',
    voucher_coupon: ''
}

const REQUIRED_FIELD_ORDER: Array<keyof GuestForm> = [
    'name',
    'email',
    'phone',
    'address',
    'region',
    'province',
    'city',
    'barangay',
];

const LOCAL_PAYMENT_MODE_HOSTS = new Set(['localhost', '127.0.0.1']);

type DraftCheckoutItem = NonNullable<CustomerCheckoutData['items']>[number];

function readCheckoutDraft(): CustomerCheckoutData | null {
    if (typeof window === 'undefined') return null;

    try {
        const raw = localStorage.getItem('guest_checkout');
        if (!raw) return null;

        const parsed = JSON.parse(raw) as CustomerCheckoutData & {
            product?: CustomerCheckoutData['product'] & { id?: number | string };
            items?: Array<DraftCheckoutItem & { id?: number | string }>;
        };

        const normalizedProductId = Number(parsed?.product?.id);
        const normalizedItems = Array.isArray(parsed.items)
            ? parsed.items.map((item) => ({
                ...item,
                id: String(item.id),
            }))
            : parsed.items;

        return {
            ...parsed,
            product: parsed.product
                ? {
                    ...parsed.product,
                    id: Number.isFinite(normalizedProductId) ? normalizedProductId : undefined,
                }
                : parsed.product,
            items: normalizedItems,
        } as CustomerCheckoutData;
    } catch {
        return null;
    }
}

function readStoredReferral(): string {
    if (typeof window === 'undefined') return '';
    return getStoredReferralCode() || '';
}

const CustomerCheckoutMain = ({ initialCategories = [] }: { initialCategories?: Category[] }) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const role = String(session?.user?.role ?? '').toLowerCase();
    const isCustomerSession = status === 'authenticated' && (role === 'customer' || role === '');
    const isLoggedIn = isCustomerSession;
    const { data: meData } = useMeQuery(undefined, { skip: !isCustomerSession });
    const { data: publicSettingsData } = useGetPublicGeneralSettingsQuery();
    const [fetchProduct, { data: fullProductData }] = useLazyGetPublicProductQuery();
    const [checkoutRefreshTrigger, setCheckoutRefreshTrigger] = useState(0);

    const checkoutData = useMemo(() => readCheckoutDraft(), [checkoutRefreshTrigger]);
    const storedReferral = useMemo(() => readStoredReferral(), []);
    const memberReferral = (meData?.referrer_username ?? '').trim();
    const effectiveReferral = isLoggedIn ? memberReferral : storedReferral;
    const hasLockedReferral = effectiveReferral.trim() !== '';
    const shouldRequireReferral = !isLoggedIn && !hasLockedReferral;

    useEffect(() => {
        if (checkoutData?.product?.id) {
            fetchProduct(checkoutData.product.id);
        }
    }, [checkoutData?.product?.id, fetchProduct]);

    useEffect(() => {
        const handleVariantChange = () => {
            setCheckoutRefreshTrigger(prev => prev + 1);
        };

        window.addEventListener('checkout-variant-changed', handleVariantChange);
        return () => window.removeEventListener('checkout-variant-changed', handleVariantChange);
    }, []);

    const [formOverrides, setFormOverrides] = useState<GuestForm>(defaultForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const requiredFieldOrder = useMemo(
        () => (isLoggedIn ? REQUIRED_FIELD_ORDER.filter((key) => key !== 'referred_by') : REQUIRED_FIELD_ORDER),
        [isLoggedIn]
    );
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('gcash');
    const [selectedOnlineBankingProvider, setSelectedOnlineBankingProvider] = useState<CheckoutOnlineBankingProvider>('dob');
    const paymentModeEnabledByAdmin = Boolean(publicSettingsData?.settings?.enable_test_payments);
    const manualCheckoutModeEnabledByAdmin = Boolean(publicSettingsData?.settings?.enable_manual_checkout_mode);
    const isLocalPaymentHost = useMemo(() => {
        if (typeof window === 'undefined') return false;
        return LOCAL_PAYMENT_MODE_HOSTS.has(window.location.hostname);
    }, []);
    const [paymentMode, setPaymentMode] = useState<PaymentMode>(() => {
        if (typeof window === 'undefined') return 'live';
        return LOCAL_PAYMENT_MODE_HOSTS.has(window.location.hostname) ? 'test' : 'live';
    });
    const [notice, setNotice] = useState('');
    const [createCheckoutSession, { isLoading: loading }] = useCreateCheckoutSessionMutation();
    const [validateVoucher, { isLoading: voucherLoading }] = useValidateVoucherMutation();
    const [voucherInfo, setVoucherInfo] = useState<{ code: string; amount: number; discount: number } | null>(null);
    const [voucherError, setVoucherError] = useState<string | null>(null);
    const canSwitchPaymentMode = isLocalPaymentHost || paymentModeEnabledByAdmin;
    const effectivePaymentMode: PaymentMode = canSwitchPaymentMode ? paymentMode : 'live';
    const paymentModeOptions = useMemo<PaymentMode[]>(
        () => (canSwitchPaymentMode ? ['test', 'live'] : ['live']),
        [canSwitchPaymentMode]
    );
    const showOnlineBankingProviderPicker = effectivePaymentMode === 'test';

    const form = useMemo<GuestForm>(() => ({
        ...defaultForm,
        ...(isLoggedIn ? {
            name: meData?.name || '',
            email: meData?.email || '',
            phone: meData?.phone || '',
            address: meData?.address || '',
            region: meData?.region || '',
            barangay: meData?.barangay || '',
            city: meData?.city || '',
            province: meData?.province || '',
            zip: meData?.zip_code || '',
        } : {}),
        ...formOverrides,
        referred_by: formOverrides.referred_by || effectiveReferral,
    }), [effectiveReferral, formOverrides, isLoggedIn, meData]);

    useEffect(() => {
        if (checkoutData) return;
        router.replace('/');
    }, [checkoutData, router]);

    useEffect(() => {
        if (!checkoutData?.product) return;
        if (!manualCheckoutModeEnabledByAdmin) return;
        if (checkoutData.product.manualCheckoutEnabled === true) return;

        localStorage.removeItem('guest_checkout');
        router.replace('/');
    }, [checkoutData, manualCheckoutModeEnabledByAdmin, router]);

    useEffect(() => {
        if (!checkoutData) return;
        const code = form.voucher_coupon.trim();

        if (!code) return;

        const handle = setTimeout(async () => {
            try {
                setVoucherError(null);
                const res = await validateVoucher({ code, subtotal: checkoutData.subtotal }).unwrap();
                setVoucherInfo({
                    code: res.voucher.code,
                    amount: res.voucher.amount,
                    discount: res.discount,
                });
                setVoucherError(null);
            } catch (error) {
                const apiError = error as { data?: { message?: string } };
                setVoucherInfo(null);
                setVoucherError(apiError?.data?.message || 'Voucher code is invalid or expired.');
            }
        }, 450);

        return () => clearTimeout(handle);
    }, [form.voucher_coupon, checkoutData, validateVoucher]);

    const setField = useCallback((key: keyof GuestForm, value: string) => {
        setFormOverrides(prev => ({ ...prev, [key]: value }))
        setErrors(prev => ({ ...prev, [key]: undefined }))
        if (key === 'voucher_coupon') {
            setVoucherInfo(null)
            setVoucherError(null)
        }
    }, [])

    const validate = (): FormErrors => {
        const e: FormErrors = {};
        if (!form.name.trim()) e.name = 'Required';
        if (!form.email.trim()) e.email = 'Required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
        if (!form.phone.trim()) e.phone = 'Required';
        if (shouldRequireReferral && !form.referred_by.trim()) e.referred_by = 'Required';
        if (!form.address.trim()) e.address = 'Required';
        if (!form.region.trim()) e.region = 'Required';
        if (!form.barangay.trim()) e.barangay = 'Required';
        if (!form.city.trim()) e.city = 'Required';
        if (!form.province.trim()) e.province = 'Required';
        return e;
    }

    const focusFirstErrorField = useCallback((validationErrors: FormErrors) => {
        const firstErrorKey = requiredFieldOrder.find((key) => Boolean(validationErrors[key]));
        if (!firstErrorKey) return;

        const target = document.querySelector<HTMLElement>(`[data-error-field="${firstErrorKey}"]`);
        if (!target) return;

        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.animate(
            [
                { transform: 'translateX(0px)' },
                { transform: 'translateX(-8px)' },
                { transform: 'translateX(8px)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0px)' },
            ],
            { duration: 420, easing: 'ease-in-out' }
        );

        const control = target.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea');
        control?.focus({ preventScroll: true });
    }, [requiredFieldOrder]);

    const handleSubmit = async () => {
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            requestAnimationFrame(() => focusFirstErrorField(errs));
            return;
        }

        if (!checkoutData) return;
        if (form.voucher_coupon.trim() && !voucherInfo) {
            setVoucherError(voucherError || 'Voucher code is invalid or expired.');
            return;
        }

        try {
            const voucherDiscount = voucherInfo?.discount ?? 0;
            const computedTotal = Math.max(0, checkoutData.subtotal - voucherDiscount) + checkoutData.handlingFee;
            const normalizedProductId = Number(checkoutData.product.id);
            const data = await createCheckoutSession({
                amount: computedTotal,
                description: checkoutData.product.name,
                payment_method: selectedMethod,
                payment_mode: canSwitchPaymentMode ? effectivePaymentMode : undefined,
                online_banking_provider: selectedMethod === 'online_banking' && showOnlineBankingProviderPicker
                    ? selectedOnlineBankingProvider
                    : undefined,
                voucher_code: voucherInfo?.code,
                source_label: checkoutData.sourceLabel ?? null,
                source_slug: checkoutData.sourceSlug ?? null,
                source_host: checkoutData.sourceHost ?? null,
                source_url: checkoutData.sourceUrl ?? null,
                customer: {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    address: `${form.address}, ${form.barangay}, ${form.city}, ${form.province}, ${form.region}${form.zip ? ` ${form.zip}` : ''}`,
                    referred_by: form.referred_by.trim(),
                    is_member: isLoggedIn,
                },
                order: {
                    product_name: checkoutData.product.name,
                    product_id: Number.isFinite(normalizedProductId) ? normalizedProductId : undefined,
                    product_sku: checkoutData.selectedSku ?? checkoutData.product.sku ?? null,
                    product_pv: checkoutData.product.prodpv ?? 0,
                    product_image: checkoutData.product.image,
                    quantity: checkoutData.quantity,
                    selected_color: checkoutData.selectedColor ?? null,
                    selected_style: checkoutData.selectedStyle ?? null,
                    selected_size: checkoutData.selectedSize ?? null,
                    selected_type: checkoutData.selectedType ?? null,
                    subtotal: checkoutData.subtotal,
                    handling_fee: checkoutData.handlingFee,
                },
            }).unwrap();

            if (!data.checkout_url) {
                alert('Failed to create checkout session')
                return
            }

            if (data.checkout_id) {
                localStorage.setItem('last_checkout_id', data.checkout_id);
                localStorage.setItem('last_checkout_payment_mode', canSwitchPaymentMode ? (data.payment_mode || effectivePaymentMode) : 'live');
            }
            localStorage.removeItem('guest_checkout');
            window.location.href = data.checkout_url;
        } catch (error) {
            const apiError = error as {
                data?: {
                    message?: string;
                    errors?: Record<string, string[]>;
                    error?: {
                        errors?: Array<{ detail?: string; code?: string; source?: Record<string, string> }>;
                    };
                };
            };

            const referralError =
                apiError?.data?.errors?.['customer.referred_by']?.[0]
                ?? apiError?.data?.errors?.referred_by?.[0];

            if (referralError) {
                const nextErrors: FormErrors = { referred_by: referralError };
                setErrors((current) => ({ ...current, ...nextErrors }));
                requestAnimationFrame(() => focusFirstErrorField(nextErrors));
                return;
            }
            const gatewayError = apiError?.data?.error?.errors?.[0]?.detail;
            alert(gatewayError || apiError?.data?.message || 'Something went wrong');
        }
    }

    if (!checkoutData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
            <TopBar />
            <Navbar initialCategories={initialCategories} />
            <main className="flex-1">
                <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">AF Home Secure Checkout</p>
                                <h1 className="text-slate-900 dark:text-white font-bold text-lg leading-tight">
                                    {isLoggedIn ? 'Checkout Details' : 'Guest Checkout'}
                                </h1>
                            </div>
                        </div>
                        <Link href="/shop" className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to shop
                        </Link>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        <div className="lg:col-span-2 space-y-5">
                            <CustomerCheckoutContactForm
                                form={form}
                                errors={errors}
                                setField={setField}
                                showReferral={!isLoggedIn}
                                lockReferralField={hasLockedReferral}
                                referralSourceCode={hasLockedReferral ? effectiveReferral : ''}
                                voucherStatus={{
                                    loading: voucherLoading,
                                    error: voucherError,
                                    appliedAmount: voucherInfo?.discount ?? 0,
                                }}
                            />
                            <CustomerCheckoutAddressForm
                                form={form}
                                errors={errors}
                                setField={setField}
                                isLoggedIn={isLoggedIn}
                            />

                            <CustomerCheckoutPaymentMethod
                                selectedMethod={selectedMethod}
                                onSelect={(m) => {
                                    setSelectedMethod(m);
                                    setNotice('');
                                }}
                                paymentMode={effectivePaymentMode}
                                paymentModeOptions={paymentModeOptions}
                                onPaymentModeChange={setPaymentMode}
                                selectedOnlineBankingProvider={selectedOnlineBankingProvider}
                                onOnlineBankingProviderChange={setSelectedOnlineBankingProvider}
                                showOnlineBankingProviderPicker={showOnlineBankingProviderPicker}
                                paymentModeSource={isLocalPaymentHost ? 'local' : paymentModeEnabledByAdmin ? 'admin' : 'hidden'}
                                notice={notice}
                            />
                        </div>

                        <div className="lg:sticky lg:top-4">
                            <CustomerCheckoutOrderSummary
                                checkoutData={checkoutData}
                                loading={loading}
                                onSubmit={handleSubmit}
                                isLoggedIn={isLoggedIn}
                                voucher={voucherInfo ? { code: voucherInfo.code, discount: voucherInfo.discount } : null}
                                computedTotal={Math.max(0, checkoutData.subtotal - (voucherInfo?.discount ?? 0)) + checkoutData.handlingFee}
                            />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default CustomerCheckoutMain
