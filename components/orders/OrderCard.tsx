'use client';

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icons";
import Image from "next/image";
import { TRACK_STEPS } from "@/types/Data";

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded';

type OrderItem = {
    id: number;
    name: string;
    image: string;
    quantity: number;
    price: number;
};

type Order = {
    id: number;
    order_number: string;
    status: OrderStatus;
    items: OrderItem[];
    total: number;
    shipping_fee: number;
    payment_method: string;
    shipping_address: string;
    created_at: string;
    estimated_delivery?: string;
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; badge: string; dot: string; step: number }> = {
    pending: { label: 'Pending', badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400', step: 1 },
    processing: { label: 'Processing', badge: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', step: 2 },
    shipped: { label: 'Shipped', badge: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500', step: 3 },
    out_for_delivery: { label: 'Out for Delivery', badge: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500', step: 4 },
    delivered: { label: 'Delivered', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', step: 5 },
    cancelled: { label: 'Cancelled', badge: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-400', step: 0 },
    refunded: { label: 'Refunded', badge: 'bg-gray-100 text-gray-600 border-gray-300', dot: 'bg-gray-400', step: 0 },
}

interface OrderCardProps {
    order: Order
}

const OrderCard = ({ order }: OrderCardProps) => {
    const [expanded, setExpanded] = useState(false);
    const config = STATUS_CONFIG[order.status];
    const previewItems = order.items.slice(0, 3);
    const extraCount = order.items.length - 3;
    const isActive = !['cancelled', 'refunded', 'delivered'].includes(order.status);

    return (
        <motion.div
            layout
            className="rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-orange-200 hover:shadow-md transition-all duration-200"
        >
            {/* CARD HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                        <Icon.Package className="h-4 w-4" />
                    </div>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900">Order #{order.order_number}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-2.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${config.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                        {config.label}
                    </span>
                    <button
                        type="button"
                        onClick={() => setExpanded((p) => !p)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Icon.ChevronDown className={`h-4 w-4 transition transform duration-200 ${expanded ? 'rotate-100' : ''}`} />
                    </button>
                </div>
            </div>

            {/* ITEMS PREVIEW  */}
            <div className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {previewItems.map((item) => (
                            <div key={item.id} className="h-10 w-10 rounded-lg border-2 border-white overflow-hidden bg-gray-100 shrink-0">
                                <Image src={item.image} alt={item.image} width={40} height={40}/>
                            </div>
                        ))}
                        {extraCount > 0 && (
                            <div className="h-10 w-10 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center shrink-0">
                                <span className="text-[11px] font-bold text-gray-500">+{extraCount}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">
                            {order.items[0].name}
                            {order.items.length > 1 && (
                                <span className="text-gray-400 mt-0.5">{order.items.length - 1} more items{order.items.length > 2 ? 's' : ''}</span>
                            )}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{order.items.reduce((s, i) => s + i.quantity, 0)} item(s)</p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</p>
                        {order.shipping_fee === 0
                            ? <p className="text-[11px] text-emerald-600 font-medium">Free shipping</p>
                            : <p className="text-[11px] text-gray-400">+{formatPrice(order.shipping_fee)} shipping</p>
                        }
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                    {order.status === 'delivered' && (
                        <button type="button" className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors">
                            <Icon.RefreshCw className="h-3.5 w-3.5"/> Reorder
                        </button>
                    )}
                    {isActive && (
                        <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors"
                        >
                            <Icon.Truck className="h-3.5 w-3.5"/> Track Order
                        </button>
                    )}
                    <button className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 px-3.5 py-2 text-xs font-semibold text-gray-600 transition-colors">
                        View Details <Icon.ChevronRight className="h-3.5 w-3.5" />
                    </button>
                    {order.status === 'pending'  && (
                        <button type="button" className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 hover:bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-500 transition-colors">
                            <Icon.X className="h-3.5 w-3.5"/> Cancel
                        </button>
                    )}
                </div>
            </div>

            {/* EXPANDED DETAIL */}
            <AnimatePresence
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-gray-100 px-5 py-4 space-y-4 bg-gray-50/50">
                        {/* TRACKING STEPS  */}
                        {order.status !== 'cancelled' && order.status !== 'refunded' && (
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Order Tracking</p>
                                <div className="relative flex items-start justify-between gap-1">
                                    {TRACK_STEPS.map((step, index) => {
                                        const stepNum = index + 1;
                                        const currentStep = config.step;
                                        const done = stepNum === currentStep;
                                        const active = stepNum === currentStep;
                                        return (
                                            <div className="flex-1 flex flex-col items-center gap-1.5 relative">
                                                {index < TRACK_STEPS.length - 1 && (
                                                    <div className={`absolute top-3 left-1/2 w-full h-0.5 ${done ? 'bg-orange-400' : 'bg-gray-200'}`}></div>
                                                )}
                                                <div className={`relative z-10 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                                    done ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-200'
                                                } ${active ? 'ring-2 ring-orange-200 ring-offset-1' : ''}`}>
                                                    {done ? <Icon.Check className="h-3 w-3 text-white"/> : <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span> }
                                                </div>
                                                <p className={`text-center text-[10px] font-medium leading-tight ${done ? 'text-orange-600' : 'text-gray-400'}`}>
                                                    {step}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                                {order.estimated_delivery && (
                                    <p className="mt-3 text-xs text-gray-500">
                                        Estimated delivery: <span className="font-semibold text-gray-700">{formatDate(order.estimated_delivery)}</span>
                                    </p>
                                )}
                            </div>
                        )}
                        </div>
                    </motion.div>
                )}
            >

            </AnimatePresence>
        </motion.div>
    )
}

export default OrderCard
