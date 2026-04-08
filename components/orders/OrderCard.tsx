'use client';

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Card, Chip } from "@heroui/react";
import Image from "next/image";
import type { CustomerOrder, CustomerOrderItem, CustomerOrderStatus } from "@/store/api/paymentApi";
import { TRACK_STEPS } from "@/types/Data";
import formatDate from "@/helpers/FormatDate";
import formatPrice from "@/helpers/FormatPrice";
import Icon from "./Icons";

const copyText = async (value: string) => {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
    throw new Error('Clipboard is not available in this browser.');
  }

  await navigator.clipboard.writeText(value);
};

const STATUS_CONFIG: Record<
  CustomerOrderStatus,
  {
    label: string;
    badge: string;
    dot: string;
    chipColor?: 'warning' | 'accent' | 'success' | 'danger' | 'default';
    step: number;
  }
> = {
  pending: { label: 'Pending', badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400', chipColor: 'warning', step: 1 },
  processing: { label: 'Processing', badge: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', chipColor: 'accent', step: 2 },
  shipped: { label: 'Shipped', badge: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500', chipColor: 'accent', step: 3 },
  out_for_delivery: { label: 'Out for Delivery', badge: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500', chipColor: 'warning', step: 4 },
  delivered: { label: 'Delivered', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', chipColor: 'success', step: 5 },
  cancelled: { label: 'Cancelled', badge: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-400', chipColor: 'danger', step: 0 },
  refunded: { label: 'Refunded', badge: 'bg-gray-100 text-gray-600 border-gray-300', dot: 'bg-gray-400', chipColor: 'default', step: 0 },
};

interface OrderCardProps {
  order: CustomerOrder;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const previewItems = order.items.slice(0, 3);
  const extraCount = order.items.length - 3;
  const isActive = !['cancelled', 'refunded', 'delivered'].includes(order.status);
  const hasShipmentInfo = Boolean(order.courier || order.tracking_no || order.shipment_status);
  const isShipmentCancelled = order.shipment_status === 'cancelled';

  const getSelectedOptions = (item: CustomerOrderItem) =>
    [
      item.selected_color ? `Color: ${item.selected_color}` : null,
      item.selected_style ? `Style: ${item.selected_style}` : null,
      item.selected_size ? `Size: ${item.selected_size}` : null,
      item.selected_type ? `Type: ${item.selected_type}` : null,
    ].filter(Boolean) as string[];

  return (
    <motion.div layout>
      <Card
        variant="default"
        className="overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-none transition-all duration-200 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/30"
      >
      <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
            <Icon.Package className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Order #{order.order_number}</p>
            <p className="mt-0.5 text-xs text-gray-400">{formatDate(order.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Chip
            size="sm"
            variant="soft"
            color={cfg.chipColor ?? 'warning'}
            className={`border ${cfg.badge}`}
          >
            <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </Chip>
          {isShipmentCancelled && (
            <Chip
              size="sm"
              variant="soft"
              color="danger"
            >
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-red-400" />
              Shipment Cancelled
            </Chip>
          )}
          <Button
            isIconOnly
            size="sm"
            variant="tertiary"
            onPress={() => setExpanded((previous) => !previous)}
            aria-label={expanded ? 'Collapse order details' : 'Expand order details'}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <Icon.ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {previewItems.map((item) => (
              <div key={item.id} className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border-2 border-white bg-gray-100">
                <Image src={item.image} alt={item.name} width={40} height={40} className="h-full w-full object-cover" />
              </div>
            ))}
            {extraCount > 0 && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-white bg-gray-100">
                <span className="text-[11px] font-bold text-gray-500">+{extraCount}</span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-gray-700">
              {order.items[0]?.name ?? 'Order item'}
              {order.items.length > 1 && (
                <span className="text-gray-400"> +{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}</span>
              )}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">{order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</p>
            {order.shipping_fee === 0 ? (
              <p className="text-[11px] font-medium text-emerald-600">Free shipping</p>
            ) : (
              <p className="text-[11px] text-gray-400">+{formatPrice(order.shipping_fee)} shipping</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {order.status === 'delivered' && (
            <Button size="sm" className="bg-orange-500 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-orange-600">
              <Icon.RefreshCw className="h-3.5 w-3.5" />
              Reorder
            </Button>
          )}
          {isActive && !isShipmentCancelled && (
            <Button size="sm" className="bg-orange-500 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-orange-600">
              <Icon.Truck className="h-3.5 w-3.5" />
              Track Order
            </Button>
          )}
          <Button
            size="sm"
            variant="tertiary"
            onPress={() => setExpanded((previous) => !previous)}
            className="border border-gray-200 px-3.5 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
          >
            View Details
            <Icon.ChevronRight className="h-3.5 w-3.5" />
          </Button>
          {order.status === 'pending' && (
            <Button size="sm" variant="danger-soft" className="px-3.5 py-2 text-xs font-semibold">
              <Icon.X className="h-3.5 w-3.5" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-gray-100 bg-gray-50/50 px-5 py-4">
              {isShipmentCancelled ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-red-600">Shipment Update</p>
                  <p className="mt-1 text-sm font-semibold text-red-700">Courier booking was cancelled.</p>
                  <p className="mt-1 text-xs text-red-600">
                    Your order is still in the system, but the courier shipment was cancelled and may need to be rebooked by the seller.
                  </p>
                </div>
              ) : order.status !== 'cancelled' && order.status !== 'refunded' && (
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Order Tracking</p>
                  <div className="relative flex items-start justify-between gap-1">
                    {TRACK_STEPS.map((step, index) => {
                      const stepNum = index + 1;
                      const currentStep = cfg.step;
                      const done = stepNum <= currentStep;
                      const active = stepNum === currentStep;

                      return (
                        <div key={step} className="relative flex flex-1 flex-col items-center gap-1.5">
                          {index < TRACK_STEPS.length - 1 && (
                            <div className={`absolute top-3 left-1/2 h-0.5 w-full ${done ? 'bg-orange-400' : 'bg-gray-200'}`} />
                          )}
                          <div
                            className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                              done ? 'border-orange-500 bg-orange-500' : 'border-gray-200 bg-white'
                            } ${active ? 'ring-2 ring-orange-200 ring-offset-1' : ''}`}
                          >
                            {done ? (
                              <Icon.Check className="h-3 w-3 text-white" />
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                            )}
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

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">Items Ordered</p>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-3 py-2.5">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <Image src={item.image} alt={item.name} width={48} height={48} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        {getSelectedOptions(item).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {getSelectedOptions(item).map((option) => (
                              <Chip
                                key={option}
                                size="sm"
                                variant="soft"
                                className="border border-orange-200 bg-orange-50 text-[11px] font-medium text-orange-700"
                              >
                                {option}
                              </Chip>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 rounded-xl border border-gray-100 bg-white px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Order Summary</p>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.total - order.shipping_fee)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Shipping</span>
                    <span className={order.shipping_fee === 0 ? 'font-medium text-emerald-600' : ''}>
                      {order.shipping_fee === 0 ? 'Free' : formatPrice(order.shipping_fee)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-1 text-sm font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-orange-600">{formatPrice(order.total)}</span>
                  </div>
                </div>

                <div className="space-y-2.5 rounded-xl border border-gray-100 bg-white px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Delivery Info</p>
                  <div className="flex items-start gap-2 text-xs text-gray-600">
                    <Icon.MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <span className="leading-relaxed">{order.shipping_address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Icon.CreditCard className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <span>{order.payment_method}</span>
                  </div>
                </div>
              </div>

              {hasShipmentInfo && (
                <div className="space-y-2.5 rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-teal-700">Shipment Details</p>
                  {order.courier && (
                    <p className="text-xs text-gray-700">
                      Courier: <span className="font-semibold uppercase">{order.courier}</span>
                    </p>
                  )}
                  {order.shipment_status && (
                    <p className="text-xs text-gray-700">
                      Shipment Status: <span className="font-semibold capitalize">{order.shipment_status.replace(/_/g, ' ')}</span>
                    </p>
                  )}
                  {order.tracking_no && (
                    <div className="rounded-xl border border-teal-200 bg-white px-3 py-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-teal-700">Tracking Number</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <p className="min-w-0 flex-1 break-all font-mono text-sm font-semibold text-gray-900">{order.tracking_no}</p>
                        <Button
                          size="sm"
                          variant="tertiary"
                          onPress={async () => {
                            try {
                              await copyText(order.tracking_no as string);
                            } catch {
                              return;
                            }
                          }}
                          className="border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-700 transition hover:bg-teal-100"
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}
                  {order.shipped_at && (
                    <p className="text-xs text-gray-500">
                      Shipped at: <span className="font-medium text-gray-700">{formatDate(order.shipped_at)}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
    </motion.div>
  );
};

export default OrderCard;
