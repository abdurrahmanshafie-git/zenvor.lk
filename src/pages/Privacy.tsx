import { motion } from 'motion/react';

export default function Privacy() {
  return (
    <div className="bg-brand-charcoal min-h-screen">
      <div className="pt-40 pb-40 px-6 md:px-20 lg:px-40 max-w-[1800px] mx-auto">
        <div className="relative mb-32 overflow-hidden py-16 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] uppercase tracking-[0.6em] font-black text-brand-gold block mb-6">DATA SECURITY</span>
            <h1 className="text-5xl md:text-[7vw] font-display font-black leading-none tracking-[-0.05em] uppercase text-white">
              PRIVACY POLICY<span className="text-brand-gold">.</span>
            </h1>
          </motion.div>
        </div>

        <div className="max-w-4xl space-y-16">
          <p className="text-brand-subtext text-base font-light italic leading-relaxed">
            At ZENVOR, we protect your data as strictly as we engineer our garments. This Privacy Policy details the protocols we follow regarding your personal information.
          </p>

          <section className="space-y-6">
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold">DATA COLLECTION & ACCOUNT INFO</h2>
            <p className="text-brand-subtext text-sm font-light italic leading-relaxed">
              When you establish an account or process an order, we collect essential coordinates: your name, email address, delivery location, and contact number. This allows us to fulfill acquisitions and optimize the studio experience.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold">ORDER PROCESSING & SECURITY</h2>
            <p className="text-brand-subtext text-sm font-light italic leading-relaxed">
              Your payment architecture is heavily encrypted. We do not store raw credit card data on our servers. Transactions are handled securely using industry-tier encryption and trusted payment gateways.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold">COOKIES & ANALYTICS</h2>
            <p className="text-brand-subtext text-sm font-light italic leading-relaxed">
              Our site employs cookies to elevate the user interface, maintain basket identity, and provide internal analytics. These metrics help us understand traffic flow and optimize site performance without compromising individual privacy.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold">COMMUNICATION PROTOCOLS</h2>
            <p className="text-brand-subtext text-sm font-light italic leading-relaxed">
              With your consent, we deploy emails regarding new archive releases, studio updates, and marketing intelligence. You may sever this communication link at any point via the unsubscribe protocol in our emails.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold">CONTACT CONCIERGE</h2>
            <p className="text-brand-subtext text-sm font-light italic leading-relaxed">
              For any queries concerning data retention or privacy, reach our concierge at zenvor.lk@gmail.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
