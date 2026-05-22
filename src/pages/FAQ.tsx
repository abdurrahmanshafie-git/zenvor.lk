import { motion } from 'motion/react';

export default function FAQ() {
  const faqs = [
    {
      q: "How long does delivery take?",
      a: "Colombo delivery takes 1–2 working days. Islandwide delivery takes 2–4 working days."
    },
    {
      q: "Do you offer Cash on Delivery?",
      a: "Yes, we offer Cash on Delivery (COD) for supported locations across Sri Lanka."
    },
    {
      q: "How do I choose the correct size?",
      a: "Our garments feature a signature oversized/drop-shoulder fit. We recommend ordering your true size for the intended structured oversized look, or sizing down if you prefer a more standard fit. Check our size matrix on the product page."
    },
    {
      q: "Can I exchange my size?",
      a: "Yes, we offer 7-day size support. If your item doesn't fit correctly, you can exchange it within 7 days of delivery, provided it is unused and in its original condition."
    },
    {
      q: "What fabric do you use?",
      a: "Each piece is constructed using premium 200 GSM heavyweight cotton. This ensures structural integrity while maintaining breathability for the modern climate."
    },
    {
      q: "How can I contact support?",
      a: "You can reach our concierge via email at zenvor.lk@gmail.com or via Instagram direct message at @zenvor.lk. Our support hours are 9.00 AM – 8.00 PM."
    },
    {
      q: "Do you deliver islandwide?",
      a: "Yes, we deliver across all locations in Sri Lanka."
    }
  ];

  return (
    <div className="bg-brand-charcoal min-h-screen">
      <div className="pt-40 pb-40 px-6 md:px-20 lg:px-40 max-w-[1800px] mx-auto">
        <div className="relative mb-32 overflow-hidden py-16 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] uppercase tracking-[0.6em] font-black text-brand-gold block mb-6">STUDIO INTELLIGENCE</span>
            <h1 className="text-5xl md:text-[8vw] font-display font-black leading-none tracking-[-0.05em] uppercase text-white">
              FAQ<span className="text-brand-gold">.</span>
            </h1>
          </motion.div>
        </div>

        <div className="max-w-4xl">
          <div className="space-y-12">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border-b border-white/10 pb-8 group"
              >
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white group-hover:text-brand-gold transition-colors duration-500 mb-6">
                  {faq.q}
                </h3>
                <p className="text-brand-subtext text-sm md:text-base font-light italic leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
