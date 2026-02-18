// 'use client';

// import { motion, AnimatePresence } from 'framer-motion';
// import { useEffect } from 'react';
// import ProductCard from './ProductCard';

// export interface CategoryProduct {
//     name: string;
//     price: number;
//     originalPrice?: number;
//     image: string;
//     badge?: string;
// }

// interface CategoryProductsModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     categoryName: string;
//     products: CategoryProduct[];
// }

// const overlayVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1 },
// };

// const modalVariants = {
//     hidden: { y: '100%', opacity: 0 },
//     visible: {
//         y: 0,
//         opacity: 1,
//         transition: { type: 'spring', damping: 30, stiffness: 300 },
//     },
//     exit: {
//         y: '100%',
//         opacity: 0,
//         transition: { duration: 0.3, ease: 'easeIn' },
//     },
// };

// const containerVariants = {
//     hidden: {},
//     visible: {
//         transition: { staggerChildren: 0.07, delayChildren: 0.15 },
//     },
// };

// const itemVariants = {
//     hidden: { opacity: 0, y: 24 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
// };

// const CategoryProductsModal = ({
//     isOpen,
//     onClose,
//     categoryName,
//     products,
// }: CategoryProductsModalProps) => {
//     useEffect(() => {
//         if (isOpen) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = '';
//         }
//         return () => { document.body.style.overflow = ''; };
//     }, [isOpen]);

//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
//                     {/* Overlay */}
//                     <motion.div
//                         className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//                         variants={overlayVariants}
//                         initial="hidden"
//                         animate="visible"
//                         exit="hidden"
//                         transition={{ duration: 0.25 }}
//                         onClick={onClose}
//                     />

//                     {/* Modal Panel */}
//                     <motion.div
//                         className="relative w-full md:max-w-5xl bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col"
//                         style={{ maxHeight: '90vh' }}
//                         variants={modalVariants}
//                         initial="hidden"
//                         animate="visible"
//                         exit="exit"
//                     >
//                         {/* Drag handle (mobile only) */}
//                         <div className="flex justify-center pt-3 pb-1 md:hidden">
//                             <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
//                         </div>

//                         {/* Header */}
//                         <div className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-gray-100">
//                             <div>
//                                 <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest mb-0.5">
//                                     Shop by Category
//                                 </p>
//                                 <h2 className="text-xl md:text-2xl font-bold text-slate-900">
//                                     {categoryName}
//                                 </h2>
//                                 <p className="text-gray-400 text-sm mt-0.5">
//                                     {products.length} Products available
//                                 </p>
//                             </div>
//                             <button
//                                 onClick={onClose}
//                                 className="p-2.5 rounded-full bg-gray-100 hover:bg-orange-100 hover:text-orange-500 transition-colors duration-200"
//                             >
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                                     <line x1="18" y1="6" x2="6" y2="18" />
//                                     <line x1="6" y1="6" x2="18" y2="18" />
//                                 </svg>
//                             </button>
//                         </div>

//                         {/* Products Grid */}
//                         <div className="overflow-y-auto flex-1 px-5 md:px-8 py-6">
//                             {products.length === 0 ? (
//                                 <div className="flex flex-col items-center justify-center py-16 text-gray-400">
//                                     <p className="mt-3 text-sm font-medium">No products yet for this category.</p>
//                                 </div>
//                             ) : (
//                                 <motion.div
//                                     className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
//                                     variants={containerVariants}
//                                     initial="hidden"
//                                     animate="visible"
//                                 >
//                                     {products.map((product, i) => (
//                                         <motion.div key={i} variants={itemVariants}>
//                                             <ProductCard {...product} />
//                                         </motion.div>
//                                     ))}
//                                 </motion.div>
//                             )}
//                         </div>

//                         {/* Footer */}
//                         <div className="px-5 md:px-8 py-4 border-t border-gray-100 flex justify-between items-center">
//                             <p className="text-xs text-gray-400">
//                                 Showing {products.length} of {products.length} products
//                             </p>
//                             <button
//                                 onClick={onClose}
//                                 className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
//                             >
//                                 Close
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                                     <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
//                                 </svg>
//                             </button>
//                         </div>
//                     </motion.div>
//                 </div>
//             )}
//         </AnimatePresence>
//     );
// };

// export default CategoryProductsModal;
