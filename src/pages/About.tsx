import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div className="bg-brand-charcoal min-h-screen selection:bg-brand-gold selection:text-brand-charcoal">
      {/* Cinematic Intro */}
      <section className="relative h-[120vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-brand-pitch/60 z-10" />
           <motion.img 
             initial={{ scale: 1.1 }}
             animate={{ scale: 1 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             src="/images/hero-zenvor.png" 
             alt="Studio Context" 
             className="w-full h-full object-cover"
             referrerPolicy="no-referrer"
           />
        </div>
        
        <div className="relative z-20 text-center px-6">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1 }}
           >
              <span className="text-[11px] uppercase tracking-[0.6em] font-black text-brand-gold block mb-8">THE DISCIPLINE</span>
              <h1 className="text-[12vw] md:text-[10vw] font-display font-black leading-none tracking-[-0.05em] uppercase text-white mix-blend-difference">
                 MANIFESTO<span className="text-brand-gold">.</span>
              </h1>
           </motion.div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4">
           <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-off-white/40">Our Foundation</p>
           <div className="h-20 w-px bg-white/10" />
        </div>
      </section>

      {/* Story Blocks */}
      <section className="py-60 px-6 md:px-20 lg:px-40 space-y-80 max-w-[1800px] mx-auto">
        {/* Block 01 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
               <motion.span 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold"
               >
                 01 / CONCEPTION
               </motion.span>
               <h2 className="text-4xl md:text-7xl font-display font-black leading-[0.9] uppercase tracking-tighter">
                  ENGINEERED<br/>FROM THE<br/>SHADOWS.
               </h2>
               <p className="text-brand-subtext text-lg md:text-2xl font-light leading-relaxed italic max-w-xl">
                  Zenvor was born in the intersection of brutalist architecture and the silent pulse of urban movement. We don't just design garments; we engineer artifacts of comfort for the modern leadsmen.
               </p>
            </div>
            <div className="relative aspect-[3/4] bg-brand-graphite overflow-hidden group">
               <img 
                src="/images/1/1.png" 
                alt="Process" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-brand-gold/10 mix-blend-overlay" />
            </div>
        </div>

        {/* Block 02 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-video lg:aspect-square order-2 lg:order-1 bg-brand-graphite overflow-hidden">
               <img 
                src="/images/2/1.png" 
                alt="Quality" 
                className="w-full h-full object-cover grayscale opacity-80"
                referrerPolicy="no-referrer"
               />
            </div>
            <div className="space-y-12 order-1 lg:order-2 lg:pl-20">
               <motion.span 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold"
               >
                 02 / QUALITY MANDATE
               </motion.span>
               <h2 className="text-4xl md:text-7xl font-display font-black leading-[0.9] uppercase tracking-tighter">
                  FABRICATION<br/>WITHOUT<br/>COMPROMISE.
               </h2>
               <p className="text-brand-subtext text-lg md:text-2xl font-light leading-relaxed italic max-w-xl">
                  Luxury shouldn't be fragile. Streetwear shouldn't be basic. We utilize heavyweight 380-450 GSM jersey that maintains skeletal structure while ensuring an immutable hand-feel.
               </p>
            </div>
        </div>
      </section>

      {/* Philosophy Grid */}
      <section className="py-40 bg-brand-pitch border-y border-white/5">
         <div className="px-6 md:px-20 lg:px-40 grid grid-cols-1 md:grid-cols-3 gap-24 max-w-[1800px] mx-auto">
            <div className="space-y-8 group">
               <h3 className="text-xs uppercase tracking-[0.4em] font-black text-brand-gold">PRECISION</h3>
               <p className="text-brand-subtext text-lg font-light leading-relaxed italic opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                  Architecturally sound construction focused on geometric silhouettes and structured draping. Every seam is intentional.
               </p>
            </div>
            <div className="space-y-8 group">
               <h3 className="text-xs uppercase tracking-[0.4em] font-black text-brand-gold">SILENCE</h3>
               <p className="text-brand-subtext text-lg font-light leading-relaxed italic opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                  We lead with presence, not volume. Minimalist branding fused with maximalist quality defines the Zenvor ethos.
               </p>
            </div>
            <div className="space-y-8 group">
               <h3 className="text-xs uppercase tracking-[0.4em] font-black text-brand-gold">HERITAGE</h3>
               <p className="text-brand-subtext text-lg font-light leading-relaxed italic opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                  A modern interpretation of classic menswear filtered through the lens of early 2000s archival streetwear culture.
               </p>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-60 text-center space-y-12 px-6">
         <h2 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter">JOIN THE ARCHIVE.</h2>
         <p className="text-brand-subtext text-lg tracking-[0.4em] font-black">CURATED EXCLUSIVELY FOR THE MODERN MINIMALIST</p>
         <div className="pt-10">
            <button className="premium-btn px-20">Acquire Drops</button>
         </div>
      </section>
    </div>
  );
}
