import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, Eye, Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import QuickViewModal from './QuickViewModal';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import SafeImage from './SafeImage';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="group relative h-full"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-brand-graphite border border-white/8 shadow-[0_18px_60px_rgba(0,0,0,0.24)]">
          <Link to={`/product/${product.id}`} className="block w-full h-full">
            <SafeImage
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              width="720"
              height="960"
              className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
              referrerPolicy="no-referrer"
            />
            
            {product.images && product.images.length > 1 && (
              <SafeImage
                src={product.images[1]}
                alt={`${product.name} alternate`}
                loading="lazy"
                decoding="async"
                width="720"
                height="960"
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000 group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />
            )}
          </Link>
          
          <div className="absolute inset-0 bg-gradient-to-t from-brand-pitch/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute bottom-3 md:bottom-5 left-3 md:left-5 right-3 md:right-5 flex items-center justify-between translate-y-3 group-hover:translate-y-0 transition-transform duration-500 delay-75 pointer-events-auto">
               <button 
                onClick={(e) => {
                  e.preventDefault();
                  setIsQuickViewOpen(true);
                }}
                className="flex-1 bg-brand-off-white text-brand-charcoal text-[8px] md:text-[10px] uppercase tracking-[0.18em] font-black py-3 md:py-4 hover:bg-brand-gold transition-colors duration-300 px-2 flex items-center justify-center gap-2"
               >
                  <Eye size={13} strokeWidth={1.6} />
                  <span>Quick View</span>
               </button>
               <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product, product.sizes[0] || 'M');
                  }}
                  aria-label={`Add ${product.name} to cart`}
                  className="ml-1.5 md:ml-2 p-3 md:p-4 bg-brand-off-white/12 text-brand-off-white hover:bg-brand-off-white hover:text-brand-charcoal backdrop-blur-md transition-all duration-300"
               >
                  <ShoppingBag size={14} className="md:w-4 md:h-4" strokeWidth={1.5} />
               </button>
               <button 
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product);
                  }}
                  className={`ml-1.5 md:ml-2 p-3 md:p-4 backdrop-blur-md transition-all duration-300 ${
                    isWishlisted 
                      ? 'bg-brand-gold text-brand-charcoal' 
                      : 'bg-brand-off-white/10 text-brand-off-white hover:bg-brand-gold hover:text-brand-charcoal'
                  }`}
               >
                  <Heart size={14} className={`md:w-4 md:h-4 ${isWishlisted ? "fill-brand-charcoal" : ""}`} strokeWidth={1.5} />
               </button>
            </div>
          </div>

          <div className="absolute top-4 left-4 right-4 pointer-events-none flex items-start justify-between gap-3">
            <span className="text-[8px] md:text-[9px] uppercase tracking-[0.28em] font-black text-white/55 group-hover:text-brand-gold transition-colors duration-500">New Arrival</span>
            {product.gsm && (
              <span className="text-[8px] uppercase tracking-[0.2em] font-black text-brand-charcoal bg-brand-off-white/85 px-2.5 py-1">
                {product.gsm} GSM
              </span>
            )}
          </div>
        </div>

        <Link to={`/product/${product.id}`} className="block mt-4 md:mt-5">
          <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5 min-w-0">
            {product.series && (
              <p className="text-[8px] md:text-[9px] uppercase tracking-[0.32em] text-brand-gold font-black">{product.series}</p>
            )}
            <h3 id={`product-name-${product.id}`} className="text-[10px] md:text-[11px] uppercase tracking-[0.16em] md:tracking-[0.2em] font-semibold text-brand-off-white/86 group-hover:text-brand-off-white transition-colors leading-relaxed">{product.name}</h3>
            <p className="text-[8px] md:text-[9px] text-brand-subtext uppercase tracking-[0.2em]">{product.category}</p>
          </div>
          <span id={`product-price-${product.id}`} className="text-[11px] md:text-[12px] font-black tracking-tight text-brand-off-white whitespace-nowrap">LKR {product.price.toLocaleString()}.00</span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/6 pt-3">
            <div className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.18em] text-brand-subtext">
              <Ruler size={11} />
              <span>{product.sizes.slice(0, 4).join(' / ')}</span>
            </div>
            {product.colors.length > 0 && (
              <div className="flex items-center gap-1.5">
                {product.colors.slice(0, 3).map((color) => (
                  <span key={color} className="h-2 w-2 rounded-full border border-white/20 bg-brand-gold/70" title={color} />
                ))}
              </div>
            )}
          </div>
        </Link>
      </motion.div>

      {isQuickViewOpen && (
         <QuickViewModal productId={product.id} onClose={() => setIsQuickViewOpen(false)} />
      )}
    </>
  );
}
