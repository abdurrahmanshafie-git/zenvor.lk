import { motion } from 'motion/react';

export default function Terms() {
  return (
    <div className="bg-brand-charcoal min-h-screen">
      <div className="pt-40 pb-40 px-6 md:px-20 lg:px-40 max-w-[1800px] mx-auto">
        <div className="relative mb-32 overflow-hidden py-16 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] uppercase tracking-[0.6em] font-black text-brand-gold block mb-6">LEGAL ARCHITECTURE</span>
            <h1 className="text-5xl md:text-[7vw] font-display font-black leading-none tracking-[-0.05em] uppercase text-white">
              TERMS &<br/>CONDITIONS<span className="text-brand-gold">.</span>
            </h1>
          </motion.div>
        </div>

        <div className="max-w-4xl space-y-16">
          <p className="text-brand-subtext text-base font-light italic leading-relaxed">
            By engaging with the ZENVOR platform and acquiring our artifacts, you accept the structural protocols defined herein.
          </p>

          <section className="space-y-6">
            <h2 className="text-xl font-black uppercase text-white">1. Product Availability & Pricing</h2>
            <p className="text-brand-subtext text-sm font-light italic leading-relaxed">
              All archive items are subject to availability. ZENVOR reserves the right to modify pricing, specifications, or descriptions without prior transmission. Prices are stated in LKR unless designated otherwise.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-black uppercase text-white">2. Order Confirmation</h2>
            <p className="text-brand-subtext text-sm font-light italic leading-relaxed">
              An order constitutes an offer to acquire. A contract is established only upon dispatch and issuance of the shipping confirmation. We reserve the right to nullify orders displaying suspicious patterns.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-black uppercase text-white">3. Delivery Logistics</h2>
            <p className="text-brand-subtext text-sm font-light italic leading-relaxed">
              Delivery schedules are estimations. We are not liable for transit delays caused by third-party couriers or unforeseen events.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-black uppercase text-white">4. Exchange Policy</h2>
            <p className="text-brand-subtext text-sm font-light italic leading-relaxed">
              Our 7-day size exchange adheres to strict quality controls. Artifacts must be structurally unmodified, unwashed, and with tags attached. We do not provide monetary refunds for change of mind.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-black uppercase text-white">5. Account Responsibility</h2>
            <p className="text-brand-subtext text-sm font-light italic leading-relaxed">
              Users are liable for optimizing their account security and passwords. ZENVOR assumes no responsibility for unauthorized account access resulting from user negligence.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-black uppercase text-white">6. Intellectual Property</h2>
            <p className="text-brand-subtext text-sm font-light italic leading-relaxed">
              All imagery, graphics, text, and source code belong to ZENVOR. Unauthorized replication or distribution of our structural assets violates our copyright and will face legal consequence.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
