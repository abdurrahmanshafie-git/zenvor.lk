import { motion } from 'motion/react';

export default function Returns() {
  return (
    <div className="bg-brand-charcoal min-h-screen">
      <div className="pt-40 pb-40 px-6 md:px-20 lg:px-40 max-w-[1800px] mx-auto">
        <div className="relative mb-32 overflow-hidden py-16 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] uppercase tracking-[0.6em] font-black text-brand-gold block mb-6">RESOLUTION PROTOCOL</span>
            <h1 className="text-5xl md:text-[7vw] font-display font-black leading-none tracking-[-0.05em] uppercase text-white">
              RETURNS &<br/>EXCHANGES<span className="text-brand-gold">.</span>
            </h1>
          </motion.div>
        </div>

        <div className="max-w-4xl space-y-16">
           <section className="space-y-6">
              <h2 className="text-xl font-black uppercase text-white">7-Day Size Support Protocol</h2>
              <p className="text-brand-subtext text-base font-light italic leading-relaxed">
                 We engineer artifacts with a specific oversized architecture. If the fit does not meet your requirements, we offer a 7-day size exchange protocol. Items must be unused, unwashed, and in their original structural condition with all tags attached.
              </p>
           </section>

           <div className="h-px bg-white/10 w-full" />

           <section className="space-y-6">
              <h2 className="text-xl font-black uppercase text-white">Exchange Process</h2>
              <ul className="text-brand-subtext text-base font-light italic leading-relaxed space-y-4 list-disc pl-6">
                 <li>Customers must contact our concierge support (zenvor.lk@gmail.com or @zenvor.lk) prior to initiating any return.</li>
                 <li>Exchanges are exclusively permitted for size adjustments.</li>
                 <li>Once approved, the item must be securely packaged and dispatched back to our headquarters.</li>
              </ul>
           </section>

           <div className="h-px bg-white/10 w-full" />

           <section className="space-y-6">
              <h2 className="text-xl font-black uppercase text-white">Damage Mitigation</h2>
              <p className="text-brand-subtext text-base font-light italic leading-relaxed">
                 In the rare event of receiving a compromised or incorrect piece, notify support within 24 hours of delivery. We will coordinate a replacement deployment immediately.
              </p>
           </section>

           <div className="h-px bg-white/10 w-full" />

           <section className="space-y-6">
              <h2 className="text-xl font-black uppercase text-white">Final Sale / Archive Items</h2>
              <p className="text-brand-subtext text-base font-light italic leading-relaxed">
                 Certain archive pieces or final sale artifacts may not be eligible for return or exchange. This is explicitly noted during the acquisition process.
              </p>
           </section>
        </div>
      </div>
    </div>
  );
}
