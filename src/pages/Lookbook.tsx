import { motion } from 'motion/react';

const LOOKBOOK_IMAGES = [
  { url: '/images/1/1.png', caption: 'Movement in Shadows', credit: 'Zenith MTN Black' },
  { url: '/images/1/1.png', caption: 'Stark Contrast', credit: 'Zenith MTN Black' },
  { url: '/images/2/1.png', caption: 'The Enso Path', credit: 'Zenith MTN White' },
  { url: '/images/2/1.png', caption: 'Earth Tones', credit: 'Zenith MTN White' },
  { url: '/images/1/1.png', caption: 'Midnight Control', credit: 'Enso Circular Black' },
  { url: '/images/1/1.png', caption: 'Minimalist Front', credit: 'Enso Circular Navy' },
];

export default function Lookbook() {
  return (
    <div className="pt-32 pb-20 bg-brand-charcoal min-h-screen">
      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-24 text-center space-y-4">
           <span className="text-brand-gold text-[10px] uppercase tracking-[0.5em] font-bold">Season 01 / Archive</span>
           <h1 className="text-6xl md:text-9xl font-light tracking-tighter leading-tight italic font-serif">
            LOOK<span className="text-brand-gold">BOOK.</span>
           </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {LOOKBOOK_IMAGES.map((img, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1, duration: 0.8 }}
               className={`relative overflow-hidden group ${i % 3 === 0 ? 'lg:col-span-2 lg:aspect-[16/9]' : 'aspect-[3/4]'}`}
             >
               <img 
                src={img.url} 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale group-hover:grayscale-0" 
                referrerPolicy="no-referrer"
               />
               <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-brand-charcoal to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-xs uppercase tracking-widest font-bold">{img.caption}</p>
                  <p className="text-[10px] text-brand-gold mt-2 tracking-widest">{img.credit}</p>
               </div>
             </motion.div>
           ))}
        </div>

        <section className="mt-32 border-t border-white/5 pt-32 text-center max-w-2xl mx-auto space-y-12">
            <h2 className="text-4xl font-display font-bold tracking-tight">The intersection of <span className="italic font-serif">brutalism</span> and <span className="text-brand-gold">luxury.</span></h2>
            <p className="text-brand-subtext font-light leading-relaxed">
                Shot on location at the Neo-Industrial Complex. 
                Photography by Zenvor Visual Studio.
            </p>
        </section>
      </div>
    </div>
  );
}
