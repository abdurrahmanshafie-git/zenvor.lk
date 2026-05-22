import { motion } from 'motion/react';

export default function Shipping() {
  return (
    <div className="bg-brand-charcoal min-h-screen">
      <div className="pt-40 pb-40 px-6 md:px-20 lg:px-40 max-w-[1800px] mx-auto">
        <div className="relative mb-32 overflow-hidden py-16 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] uppercase tracking-[0.6em] font-black text-brand-gold block mb-6">LOGISTICS</span>
            <h1 className="text-5xl md:text-[7vw] font-display font-black leading-none tracking-[-0.05em] uppercase text-white">
              SHIPPING INFO<span className="text-brand-gold">.</span>
            </h1>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 max-w-6xl">
          <div className="space-y-16">
             <div className="space-y-6">
                <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold">DOMESTIC DEPLOYMENT</h2>
                <div className="space-y-8">
                   <div>
                      <h3 className="text-xl font-black uppercase text-white mb-2">Colombo Delivery</h3>
                      <p className="text-brand-subtext font-light italic">Transit Time: 1–2 working days<br/>Charge: LKR 350</p>
                   </div>
                   <div>
                      <h3 className="text-xl font-black uppercase text-white mb-2">Islandwide Delivery</h3>
                      <p className="text-brand-subtext font-light italic">Transit Time: 2–4 working days<br/>Charge: LKR 450</p>
                   </div>
                   <div>
                      <h3 className="text-xl font-black uppercase text-brand-off-white mb-2">Complimentary Transit</h3>
                      <p className="text-brand-gold font-black uppercase tracking-widest text-xs">Free delivery for orders above LKR 10,000.</p>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="space-y-16">
             <div className="space-y-6">
                <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold">ORDER PROCESSING</h2>
                <p className="text-brand-subtext text-sm font-light italic leading-relaxed">
                   Once an acquisition is confirmed, processing requires 24 hours. Orders placed after 12:00 PM are processed the following business day. Delivery times are estimated and commence from the date of shipping, rather than the date of order.
                </p>
             </div>
             <div className="space-y-6">
                <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold">PAYMENT PROTOCOLS</h2>
                <p className="text-brand-subtext text-sm font-light italic leading-relaxed">
                   We support Cash on Delivery (COD) across all verified Sri Lankan zones. Secure checkout via card is also supported.
                </p>
             </div>
             <div className="space-y-6">
                <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold">DELAY NOTICES</h2>
                <p className="text-brand-subtext text-sm font-light italic leading-relaxed">
                   During high-demand periods or public holidays, minor delays may occur. Our concierge will inform you of any unexpected transit disruptions.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
