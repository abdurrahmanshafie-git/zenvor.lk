import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, MailCheck, PackageCheck, Truck } from 'lucide-react';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();

  return (
    <div className="bg-brand-charcoal min-h-screen flex items-center justify-center px-4 sm:px-6 py-28 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl w-full bg-brand-pitch border border-white/8 p-6 sm:p-8 md:p-16 text-center space-y-8 md:space-y-10 relative overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 bg-brand-gold/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto h-20 w-20 md:h-24 md:w-24 border border-brand-gold/40 bg-brand-gold/10 flex items-center justify-center"
        >
          <Check size={38} className="text-brand-gold" strokeWidth={1.5} />
        </motion.div>

        <div className="relative z-10 space-y-4">
          <p className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-gold">ZENVOR ORDER</p>
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter text-white">
            Order Confirmed
          </h1>
          <p className="mx-auto max-w-xl text-brand-subtext text-sm md:text-base leading-relaxed">
            Thank you for your order. We’ve sent the order details to your email.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-left">
          <div className="border border-white/10 bg-white/[0.02] p-5 md:p-6">
            <PackageCheck size={18} className="text-brand-gold mb-4" />
            <p className="text-[9px] uppercase tracking-[0.24em] font-black text-brand-subtext mb-2">ORDER ID</p>
            <p className="text-sm md:text-base font-black tracking-widest text-white break-all">{orderNumber}</p>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-5 md:p-6">
            <MailCheck size={18} className="text-brand-gold mb-4" />
            <p className="text-[9px] uppercase tracking-[0.24em] font-black text-brand-subtext mb-2">EMAIL SENT</p>
            <p className="text-xs uppercase tracking-widest text-white leading-relaxed">Order details delivered</p>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-5 md:p-6">
            <Truck size={18} className="text-brand-gold mb-4" />
            <p className="text-[9px] uppercase tracking-[0.24em] font-black text-brand-subtext mb-2">DELIVERY</p>
            <p className="text-xs uppercase tracking-widest text-white leading-relaxed">2-4 working days</p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link to="/shop" className="premium-btn h-14">Continue Shopping</Link>
          <Link to="/tracking" className="premium-btn-outline h-14">Track Order</Link>
        </div>
      </motion.div>
    </div>
  );
}
