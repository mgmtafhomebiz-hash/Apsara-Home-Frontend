// ─── Types ────────────────────────────────────────────────────────────────────


type OrderItem = {
  id: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

// export const MOCK_ORDERS: Order[] = [
//   {
//     id: 1,
//     order_number: 'AF-19341',
//     status: 'delivered',
//     items: [
//       { id: 1, name: 'Gaynour L-Shape Sofa', image: '/Images/HeroSection/sofas.jpg', quantity: 1, price: 45999 },
//       { id: 2, name: 'Zooey Cutlery Set', image: '/Images/FeaturedSection/zooey_cutlery.png', quantity: 2, price: 1299 },
//     ],
//     total: 48597,
//     shipping_fee: 0,
//     payment_method: 'GCash',
//     shipping_address: 'Unit 12B, Sapphire Residences, Quezon City',
//     created_at: '2025-01-15',
//     estimated_delivery: '2025-01-20',
//   },
//   {
//     id: 2,
//     order_number: 'AF-19278',
//     status: 'shipped',
//     items: [
//       { id: 3, name: 'Bently Chest Drawer', image: '/Images/FeaturedSection/bently_chest_drawer.png', quantity: 1, price: 18500 },
//     ],
//     total: 19000,
//     shipping_fee: 500,
//     payment_method: 'Credit Card',
//     shipping_address: 'Block 7 Lot 15, Magsaysay St., Cebu City',
//     created_at: '2025-02-01',
//     estimated_delivery: '2025-02-07',
//   },
//   {
//     id: 3,
//     order_number: 'AF-19102',
//     status: 'processing',
//     items: [
//       { id: 4, name: 'Sarah Corner L-Shaped Sofa', image: '/Images/FeaturedSection/sarah_corner_l-shaped.png', quantity: 1, price: 52000 },
//       { id: 5, name: 'Dining Table Set', image: '/Images/HeroSection/Dinning_table.jpg', quantity: 1, price: 24999 },
//       { id: 6, name: 'Zooey Cutlery Set', image: '/Images/FeaturedSection/zooey_cutlery.png', quantity: 4, price: 1299 },
//     ],
//     total: 82194,
//     shipping_fee: 0,
//     payment_method: 'Bank Transfer',
//     shipping_address: 'Unit 12B, Sapphire Residences, Quezon City',
//     created_at: '2025-02-10',
//     estimated_delivery: '2025-02-18',
//   },
//   {
//     id: 4,
//     order_number: 'AF-18990',
//     status: 'cancelled',
//     items: [
//       { id: 7, name: 'TV Rack Cabinet', image: '/Images/HeroSection/tv_racks.jpg', quantity: 1, price: 12500 },
//     ],
//     total: 13000,
//     shipping_fee: 500,
//     payment_method: 'GCash',
//     shipping_address: 'Block 7 Lot 15, Magsaysay St., Cebu City',
//     created_at: '2025-01-05',
//   },
//   {
//     id: 5,
//     order_number: 'AF-19400',
//     status: 'pending',
//     items: [
//       { id: 8, name: 'Chairs & Stools Set', image: '/Images/HeroSection/chairs_stools.jpg', quantity: 3, price: 4500 },
//     ],
//     total: 14000,
//     shipping_fee: 500,
//     payment_method: 'Cash on Delivery',
//     shipping_address: 'Unit 12B, Sapphire Residences, Quezon City',
//     created_at: '2025-02-18',
//     estimated_delivery: '2025-02-25',
//   },
// ]

export const TRACK_STEPS = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export const TABS = [
  { key: 'all',             label: 'All Orders' },
  { key: 'pending',         label: 'Pending' },
  { key: 'processing',      label: 'Processing' },
  { key: 'shipped',         label: 'Shipped' },
  { key: 'delivered',       label: 'Delivered' },
  { key: 'cancelled',       label: 'Cancelled' },
] as const;

// export const STATUS_CONFIG: Record<OrderStatus, { label: string; badge: string; dot: string; step: number }> = {
//   pending:          { label: 'Pending',          badge: 'bg-amber-50 text-amber-700 border-amber-200',    dot: 'bg-amber-400',   step: 1 },
//   processing:       { label: 'Processing',       badge: 'bg-blue-50 text-blue-700 border-blue-200',       dot: 'bg-blue-500',    step: 2 },
//   shipped:          { label: 'Shipped',           badge: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500',  step: 3 },
//   out_for_delivery: { label: 'Out for Delivery', badge: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500',  step: 4 },
//   delivered:        { label: 'Delivered',        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', step: 5 },
//   cancelled:        { label: 'Cancelled',        badge: 'bg-red-50 text-red-600 border-red-200',          dot: 'bg-red-400',     step: 0 },
//   refunded:         { label: 'Refunded',         badge: 'bg-gray-100 text-gray-600 border-gray-300',      dot: 'bg-gray-400',    step: 0 },
// }

