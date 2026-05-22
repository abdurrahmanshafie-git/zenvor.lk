import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, removeFromCart, cartTotal } = useCart();
  
  const delivery = 350;
  const isFreeDelivery = cartTotal > 10000;
  const finalDelivery = isFreeDelivery ? 0 : delivery;
  const finalTotal = cartTotal + finalDelivery;

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-brand-charcoal/80 backdrop-blur-sm z-[150]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-pitch border-l border-white/10 z-[160] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/5">
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold">ARCHIVE QUEUE</span>
              <button onClick={onClose} className="text-brand-subtext hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {cartItems.length > 0 ? cartItems.map((item, i) => (
                <motion.div
                  key={item.cartItemId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="flex space-x-6 group"
                >
                  <div className="w-24 aspect-[3/4] bg-brand-graphite overflow-hidden relative">
                    <img src={item.images ? item.images[0] : item.image} alt={item.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                         <h4 className="text-xs font-black uppercase tracking-widest text-white leading-tight">{item.name}</h4>
                         <button onClick={() => removeFromCart(item.cartItemId)} className="text-brand-subtext hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                         </button>
                      </div>
                      <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-gold mt-2">SIZE: {item.selectedSize}</p>
                    </div>
                    <div className="flex justify-between items-end">
                       <p className="text-[10px] font-bold text-brand-subtext">QTY: {item.quantity}</p>
                       <p className="text-sm font-black tracking-widest text-brand-off-white">LKR {item.price * item.quantity}.00</p>
                    </div>
                  </div>
                </motion.div>
              )) : (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-subtext">ARCHIVE QUEUE EMPTY</p>
                 </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
            <div className="p-8 border-t border-white/5 bg-brand-charcoal">
               <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-subtext">SUBTOTAL</span>
                     <span className="text-lg font-display font-black tracking-tighter text-white">LKR {cartTotal}.00</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-black text-brand-subtext">
                     <span>DELIVERY (COLOMBO)</span>
                     <span>LKR {finalDelivery}.00</span>
                  </div>
                  {isFreeDelivery && (
                    <div className="text-[9px] uppercase tracking-widest text-brand-gold text-right">Qualifies for Free Delivery</div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                     <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white">EST. TOTAL</span>
                     <span className="text-2xl font-display font-black tracking-tighter text-brand-gold">LKR {finalTotal}.00</span>
                  </div>
               </div>
               
               <p className="text-[9px] uppercase tracking-widest text-brand-subtext text-center mb-6">
                  CASH ON DELIVERY AVAILABLE. SECURE CHECKOUT.
               </p>

               <div className="space-y-4">
                  <Link to="/cart" onClick={onClose} className="premium-btn w-full h-16 flex items-center justify-center">
                     VIEW MANIFEST
                  </Link>
                  <Link to="/checkout" onClick={onClose} className="w-full h-16 border border-white/10 flex items-center justify-center space-x-4 group hover:bg-white/5 transition-colors">
                     <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white">CHECKOUT</span>
                     <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>
            )}
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
