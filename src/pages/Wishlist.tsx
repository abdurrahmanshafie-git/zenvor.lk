import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleMoveToCart = (product: any) => {
    // Assuming default size is the first one for wishlist -> cart quick add
    // Ideally we should open a size selector, but for now we'll pick the first
    const size = product.sizes?.[0] || 'L';
    addToCart(product, size, 1);
    removeFromWishlist(product.id);
  };

  return (
    <div className="bg-brand-charcoal min-h-screen">
      <div className="pt-24 md:pt-40 pb-24 md:pb-40 px-4 md:px-20 lg:px-40 max-w-[1800px] mx-auto">
        <div className="flex flex-col space-y-4 md:space-y-6 mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-black text-brand-gold">PERSONAL CURATION</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-[8vw] font-display font-black leading-none tracking-[-0.05em] uppercase text-white"
          >
            THE ARCHIVE<span className="text-brand-gold">.</span>
          </motion.h1>
          <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="text-brand-subtext text-sm md:text-lg italic font-light"
          >
             Artifacts awaiting acquisition. Your private selection of architectural silhouettes.
          </motion.p>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-12 gap-y-12 md:gap-y-24">
            <AnimatePresence>
              {wishlistItems.map((item, i) => (
                  <motion.div 
                   key={item.id}
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.1 }}
                   className="relative group"
                 >
                    <div className="absolute top-6 left-6 z-10">
                       <button onClick={() => removeFromWishlist(item.id)} className="h-10 w-10 bg-brand-charcoal/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-charcoal transition-all duration-500">
                          <X size={16} />
                       </button>
                    </div>
                    <ProductCard product={item} />
                    <button onClick={() => handleMoveToCart(item)} className="w-full mt-4 h-12 border border-white/10 flex items-center justify-center space-x-3 text-[10px] uppercase tracking-[0.3em] font-black hover:bg-white/5 transition-colors">
                       <ShoppingBag size={14} />
                       <span>Move to Cart</span>
                    </button>
                 </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-40 space-y-12">
             <div className="relative inline-block">
                <Heart size={120} className="mx-auto text-brand-graphite/40" />
                <motion.div 
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 border border-brand-gold/10 rounded-full scale-150 p-20" 
                />
             </div>
             <div className="space-y-4">
                <p className="text-brand-subtext uppercase tracking-[0.5em] text-xs font-black">YOUR ARCHIVE COLLECTION IS CURRENTLY VOID.</p>
                <p className="text-[10px] text-brand-subtext/40 tracking-widest">SAVE PIECES TO THE ARCHIVE FOR FUTURE ACQUISITION</p>
             </div>
             <Link to="/shop" className="premium-btn px-20 inline-block h-16 flex items-center justify-center pt-5">
               EXPLORE ARCHIVE
             </Link>
          </div>
        )}

        <div className="mt-40 border-t border-white/5 pt-20 flex justify-between items-center">
           <Link to="/shop" className="group flex items-center space-x-4 text-[10px] uppercase tracking-[0.4em] font-black text-brand-subtext hover:text-white transition-colors">
             <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> 
             <span>RETURN TO THE STUDIO</span>
           </Link>
           <button className="premium-btn px-12 h-14">Acquire All Items</button>
        </div>
      </div>
    </div>
  );
}
