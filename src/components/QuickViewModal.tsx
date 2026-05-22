import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Ruler, Heart } from 'lucide-react';
import { PRODUCTS } from '../data';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { useProduct } from '../hooks/useProducts';

interface QuickViewModalProps {
  productId: string | null;
  onClose: () => void;
}

export default function QuickViewModal({ productId, onClose }: QuickViewModalProps) {
  const { product: dbProduct, loading } = useProduct(productId || undefined);
  const staticProduct = PRODUCTS.find((p) => p.id === productId);
  const product = dbProduct || staticProduct;
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      addToast('Please select a size first', 'error');
      return;
    }
    addToCart(product, selectedSize, 1);
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-brand-charcoal/80 backdrop-blur-md z-[110]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl bg-brand-pitch border border-white/10 z-[120] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[70vh] max-h-[800px]"
          >
            <button
               onClick={onClose}
               className="absolute top-6 right-6 z-20 text-brand-subtext hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {loading ? (
               <div className="w-full flex flex-col items-center justify-center space-y-6 bg-brand-charcoal">
                  <div className="w-12 h-12 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold animate-pulse">Analyzing Artifact...</p>
               </div>
            ) : (
                <>
                  {/* Image side */}
            <div className="w-full md:w-1/2 h-[40vh] md:h-full bg-brand-graphite relative overflow-hidden group">
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/50 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.4em] font-black text-white mix-blend-difference">
                 SKU-{product.id}
              </div>
            </div>

            {/* Info side */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between overflow-y-auto custom-scrollbar bg-brand-charcoal">
               <div className="space-y-6">
                 <div>
                    <span className="block text-[10px] uppercase tracking-[0.5em] text-brand-gold font-black mb-4">
                      {product.category}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-display font-black leading-none uppercase tracking-tighter">
                      {product.name}
                    </h2>
                 </div>
                 
                 <p className="text-2xl font-black text-brand-off-white tracking-widest">LKR {product.price}.00</p>
                 
                 <div className="h-px bg-white/5 w-full my-8" />
                 
                 <p className="text-brand-subtext text-sm font-light italic leading-relaxed">
                   {product.description}
                 </p>
               </div>

               <div className="mt-12 space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.3em] font-black text-brand-subtext">
                       <span>Select Size</span>
                       <span className="flex items-center text-brand-gold cursor-pointer hover:text-white transition-colors">
                          <Ruler size={12} className="mr-2"/> Matrix
                       </span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                       {product.sizes.map((s) => (
                         <button 
                           key={s} 
                           onClick={() => setSelectedSize(s)}
                           className={`h-12 border text-xs font-black uppercase tracking-widest transition-colors ${
                              selectedSize === s 
                                ? 'bg-brand-off-white text-brand-charcoal border-brand-off-white' 
                                : 'border-white/10 text-brand-subtext hover:border-brand-gold hover:text-white'
                           }`}
                         >
                           {s}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="flex space-x-4">
                   <button onClick={handleAddToCart} className="premium-btn flex-1 h-16 flex items-center justify-center space-x-4">
                      <ShoppingBag size={18} />
                      <span>ADD TO ARCHIVE</span>
                   </button>
                   <button 
                      onClick={() => toggleWishlist(product)}
                      className={`h-16 w-16 border flex items-center justify-center transition-all duration-500 flex-shrink-0 ${
                        isWishlisted ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-white/10 hover:border-brand-gold text-brand-subtext hover:text-white'
                      }`}
                   >
                     <Heart size={18} className={isWishlisted ? "fill-brand-gold" : ""} />
                   </button>
                 </div>
               </div>
             </div>
           </>
          )}
        </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
