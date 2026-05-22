import { motion, AnimatePresence } from 'motion/react';
import { Trash2, ShoppingBag, Plus, Minus, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  
  const delivery = 350;
  const isFreeDelivery = cartTotal >= 10000;
  const finalDelivery = isFreeDelivery ? 0 : delivery;
  const finalTotal = cartTotal + finalDelivery;

  return (
    <div className="bg-brand-charcoal min-h-screen">
      <div className="pt-24 md:pt-40 pb-24 md:pb-40 px-4 md:px-20 lg:px-40 max-w-[1800px] mx-auto">
        <div className="flex flex-col space-y-4 md:space-y-6 mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-black text-brand-gold">ACQUISITION QUEUE</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-[8vw] font-display font-black leading-none tracking-[-0.05em] uppercase text-white"
          >
            THE BAG<span className="text-brand-gold">.</span>
          </motion.h1>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            {/* List */}
            <div className="lg:col-span-8 flex flex-col space-y-12 md:space-y-16">
               <AnimatePresence>
                  {cartItems.map((item, i) => (
                   <motion.div 
                    key={item.cartItemId} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 lg:space-x-12 pb-10 md:pb-16 border-b border-white/5 last:border-0 group"
                   >
                      <div className="w-full md:w-64 aspect-[3/4] bg-brand-graphite overflow-hidden relative">
                         <img src={item.images ? item.images[0] : item.image} alt={item.name} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" referrerPolicy="no-referrer" />
                         <div className="absolute top-4 left-4">
                            <span className="text-[8px] uppercase tracking-widest font-black py-1 px-3 bg-brand-charcoal/40 backdrop-blur-md border border-white/5">ITEM_{item.id}</span>
                         </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-2">
                         <div className="space-y-8">
                            <div className="flex justify-between items-start">
                               <div className="space-y-2">
                                 <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight">{item.name}</h3>
                                 <p className="text-[9px] md:text-[10px] text-brand-gold uppercase tracking-[0.2em] md:tracking-[0.4em] font-black">ARCHIVE SIZE: {item.selectedSize}</p>
                               </div>
                               <button onClick={() => removeFromCart(item.cartItemId)} className="text-brand-subtext hover:text-red-500 transition-colors duration-500 p-2">
                                 <Trash2 size={20} strokeWidth={1.5} />
                               </button>
                            </div>
                            <p className="text-brand-subtext text-sm font-light italic leading-relaxed max-w-md">
                               {item.description || "Signature box-trunk silhouette with drop-shoulder ergonomics. Engineered for the curation of space."}
                            </p>
                         </div>
                         
                         <div className="flex justify-between items-end mt-12">
                            <div className="flex items-center space-x-10 border border-white/10 h-14 px-8">
                               <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="text-brand-subtext hover:text-white transition-colors"><Minus size={14} /></button>
                               <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                               <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="text-brand-subtext hover:text-white transition-colors"><Plus size={14} /></button>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] text-brand-subtext uppercase tracking-widest mb-1 italic">Line Total</p>
                               <span className="text-xl md:text-2xl font-black text-brand-off-white tracking-widest">LKR {item.price * item.quantity}.00</span>
                            </div>
                         </div>
                      </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
               
               <div className="pt-20">
                  <Link to="/shop" className="group inline-flex items-center space-x-4 text-[10px] uppercase tracking-[0.4em] font-black text-brand-subtext hover:text-white transition-colors">
                    <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> 
                    <span>RE-ENTER THE ARCHIVE</span>
                  </Link>
               </div>
            </div>

            {/* Acquisition Summary */}
            <div className="lg:col-span-4">
              <div className="bg-brand-pitch p-6 md:p-12 lg:p-16 border border-white/5 sticky top-24 md:top-32 space-y-12 md:space-y-16">
                 <div className="space-y-4">
                    <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-gold">ORDER MANIFEST</h2>
                    <div className="h-px bg-white/5 w-full" />
                 </div>
                 
                 <div className="space-y-8">
                    <div className="flex justify-between text-[11px] uppercase tracking-widest font-black text-brand-subtext">
                       <span>SUB-ARCHIVE TOTAL</span>
                       <span className="text-white">LKR {cartTotal}.00</span>
                    </div>
                    <div className="flex justify-between text-[11px] uppercase tracking-widest font-black text-brand-subtext">
                       <span>LOGISTICS (COLOMBO)</span>
                       <span className="text-white">LKR {finalDelivery}.00</span>
                    </div>
                    {isFreeDelivery && (
                       <div className="text-[9px] uppercase tracking-widest text-brand-gold text-right">LKR 10,000+ - Free Shipping Applied</div>
                    )}
                 </div>

                 <div className="pt-8 md:pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div className="space-y-1">
                       <span className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-subtext">TOTAL ACQUISITION</span>
                    </div>
                    <span className="text-3xl lg:text-4xl font-display font-black text-brand-off-white tracking-tighter">LKR {finalTotal}.00</span>
                 </div>

                 <div className="space-y-8">
                    <Link to="/checkout" className="premium-btn w-full h-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group flex items-center justify-center">
                       <span className="group-hover:tracking-[0.6em] transition-all duration-700">COMMIT ACQUISITION</span>
                    </Link>
                    
                    <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-brand-gold text-center">
                      CASH ON DELIVERY AVAILABLE IN SRI LANKA
                    </p>

                    <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-12">
                       <div className="space-y-3">
                          <Truck size={16} className="text-brand-gold" />
                          <p className="text-[9px] uppercase tracking-widest font-bold text-brand-subtext leading-relaxed">1-4 Days Islandwide Delivery</p>
                       </div>
                       <div className="space-y-3">
                          <ShieldCheck size={16} className="text-brand-gold" />
                          <p className="text-[9px] uppercase tracking-widest font-bold text-brand-subtext leading-relaxed">Encrypted Transaction Protocol</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-40 space-y-12">
             <div className="relative inline-block">
                <ShoppingBag size={120} className="mx-auto text-brand-graphite/40" />
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-dashed border-white/5 rounded-full p-20" 
                />
             </div>
             <div className="space-y-4">
                <p className="text-brand-subtext uppercase tracking-[0.5em] text-xs font-black">YOUR ARCHIVE COLLECTION IS EMPTY.</p>
                <p className="text-[10px] text-brand-subtext/40 tracking-widest">AWAITING SELECTION FOR ACQUISITION</p>
             </div>
             <Link to="/shop" className="premium-btn px-20 inline-block h-16 flex items-center justify-center pt-5">
               INITIALIZE ACQUISITION
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
