'use client';

import { FormErrors, GuestForm } from "@/types/CustomerCheckout/types";

interface CustomerCheckoutAddressFormProps {
    form: GuestForm;
    errors: FormErrors;
    setField: (key: keyof GuestForm, value: string) => void;
}

const Field = ({ label, value, onChange, placeholder, required = false, error }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder: string; required?: boolean; error?: string;
}) => (
    <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <input
            type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                    : 'border-slate-200 focus:ring-orange-200 focus:border-orange-400'
                }`}
        />
        {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
    </div>
)

const CustomerCheckoutAddressForm = ({ form, errors, setField }: CustomerCheckoutAddressFormProps) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2.5">
                <div className="h-6 w-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">2</div>
                Delivery Address
            </h2>
            {/* STREET / BARANGAY */}
            <div className="space-y-3">
                <Field
                    label="Street / House No. / Barangany"
                    value={form.address}
                    onChange={v => setField('address', v)}
                    placeholder="e.g. 123 Rizal St., Brgy. San Jose"
                    required
                    error={errors.address}
                />
                {/* CITY + PROVINCE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="City / Municipality" value={form.city} onChange={v => setField('city', v)} placeholder="e.g. Quezon City" required error={errors.city} />
                    <Field label="Province" value={form.province} onChange={v => setField('province', v)} placeholder="e.g Metro Manila" />
                </div>
                <Field label="ZIP Code" value={form.zip} onChange={v => setField('zip', v)} placeholder="e.g. 1234" />

                <div className="flex items-start gap-2.5 p-3 bg-amber-50 rounded-xl border border-orange-100 mt-1">
                    <svg className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs texxt-orange-700 leading-relaxed">
                        Nationwide delivery available. Delivery time may vary per location.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CustomerCheckoutAddressForm
