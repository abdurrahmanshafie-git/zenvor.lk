import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import SafeImage from '../components/SafeImage';

const COLLECTIONS = [
  { name: 'Drop Shoulder', year: '2026', image: '/images/1/1.png', desc: 'The architecture of movement.' },
  { name: 'Regular Fit', year: '2026', image: '/images/2/1.png', desc: 'Heavyweight essentials with quiet structure.' },
  { name: 'Over Sized', year: '2026', image: '/images/3/1.png', desc: 'Volume, proportion, and modern restraint.' },
];

export default function Collections() {
  return (
    <div className="pt-28 md:pt-36 pb-24 md:pb-32 px-4 md:px-12 bg-brand-charcoal min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-display font-black uppercase leading-none mb-16 md:mb-24">Series.</h1>
        
        <div className="space-y-32">
          {COLLECTIONS.map((col, i) => (
            <motion.div 
              key={col.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
            >
              <div className="lg:w-1/2 aspect-[16/11] bg-brand-graphite overflow-hidden group relative border border-white/8">
                 <SafeImage src={col.image} alt={col.name} loading="lazy" className="w-full h-full object-cover grayscale-[0.25] group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                 <div className="absolute inset-0 bg-brand-charcoal/20 group-hover:bg-transparent transition-all" />
              </div>
              <div className="lg:w-1/2 space-y-6">
                 <span className="editorial-eyebrow">{col.year} Series</span>
                 <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black uppercase leading-none">{col.name}</h2>
                 <p className="text-brand-subtext text-base md:text-lg font-light leading-relaxed">{col.desc}</p>
                 <Link to="/shop" className="premium-btn inline-block">Explore Drop</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
