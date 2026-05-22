import { motion } from 'motion/react';
import { Package, Search, MapPin, Truck, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';

export default function OrderTracking() {
  const [trackingId, setTrackingId] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setIsTracking(true);
    }
  };

  return (
    <div className="bg-brand-charcoal min-h-screen">
      <div className="pt-40 pb-40 px-6 md:px-20 lg:px-40 max-w-[1800px] mx-auto">
        <div className="relative mb-24 overflow-hidden py-16 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] uppercase tracking-[0.6em] font-black text-brand-gold block mb-6">LOGISTICS</span>
            <h1 className="text-5xl md:text-[7vw] font-display font-black leading-none tracking-[-0.05em] uppercase text-white">
              TRACK ORDER<span className="text-brand-gold">.</span>
            </h1>
          </motion.div>
        </div>

        <div className="max-w-3xl">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 mb-16">
            <div className="flex-1 relative">
               <Package size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-subtext" />
               <input
                 type="text"
                 value={trackingId}
                 onChange={(e) => setTrackingId(e.target.value)}
                 placeholder="ENTER TRACKING OR ORDER ID"
                 className="w-full bg-brand-pitch border border-white/10 h-20 pl-16 pr-6 outline-none focus:border-brand-gold transition-colors text-sm uppercase tracking-widest font-black placeholder:text-brand-subtext/40"
               />
            </div>
            <button type="submit" className="premium-btn px-12 h-20 flex items-center justify-center space-x-3">
               <Search size={18} />
               <span>LOCATE</span>
            </button>
          </form>

          {isTracking && (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-brand-pitch border border-white/5 p-8 md:p-16 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-3xl opacity-20 pointer-events-none" />
                
                <div className="space-y-12 relative z-10">
                   <div>
                      <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-subtext mb-2">ARCHIVE TRACKING ID</h3>
                      <p className="text-2xl font-display font-black uppercase text-white">{trackingId || 'ZNVR-8092-LK'}</p>
                   </div>

                   <div className="h-px bg-white/5 w-full" />

                   <div className="space-y-10">
                      <div className="flex items-start space-x-6">
                         <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 size={18} className="text-brand-gold" />
                         </div>
                         <div className="pt-2">
                            <h4 className="text-xs uppercase tracking-widest font-black text-white">Order Confirmed</h4>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-subtext mt-1">Colombo HQ</p>
                         </div>
                      </div>

                      <div className="flex items-start space-x-6 opacity-50 relative">
                         <div className="absolute left-6 -top-10 w-px h-10 bg-white/10" />
                         <div className="w-12 h-12 rounded-full bg-brand-charcoal border border-white/10 flex items-center justify-center flex-shrink-0">
                            <Package size={18} className="text-white" />
                         </div>
                         <div className="pt-2">
                            <h4 className="text-xs uppercase tracking-widest font-black text-white">In Transit</h4>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-subtext mt-1">Pending scan</p>
                         </div>
                      </div>

                      <div className="flex items-start space-x-6 opacity-30 relative">
                         <div className="absolute left-6 -top-10 w-px h-10 bg-white/10" />
                         <div className="w-12 h-12 rounded-full bg-brand-charcoal border border-white/10 flex items-center justify-center flex-shrink-0">
                            <Truck size={18} className="text-white" />
                         </div>
                         <div className="pt-2">
                            <h4 className="text-xs uppercase tracking-widest font-black text-white">Out for Delivery</h4>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-subtext mt-1">Awaiting dispatch</p>
                         </div>
                      </div>

                      <div className="flex items-start space-x-6 opacity-30 relative">
                         <div className="absolute left-6 -top-10 w-px h-10 bg-white/10" />
                         <div className="w-12 h-12 rounded-full bg-brand-charcoal border border-white/10 flex items-center justify-center flex-shrink-0">
                            <MapPin size={18} className="text-white" />
                         </div>
                         <div className="pt-2">
                            <h4 className="text-xs uppercase tracking-widest font-black text-white">Delivered</h4>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-subtext mt-1">Destination coordinates</p>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
