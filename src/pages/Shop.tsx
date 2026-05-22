import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, ChevronDown, LayoutGrid, List, X, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data';
import { useProducts } from '../hooks/useProducts';
import SEO from '../components/SEO';

export default function Shop() {
  const { products, loading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const categories = ['All', 'Drop Shoulder', 'Regular Fit', 'Over Sized'];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Use fetched products if available, fallback to static data
  const baseProducts = products.length > 0 ? products : PRODUCTS;

  const filteredProducts = selectedCategory === 'All' 
    ? baseProducts 
    : baseProducts.filter(p => p.category.includes(selectedCategory) || p.name.includes(selectedCategory));

  return (
    <div className="bg-brand-charcoal min-h-screen">
      <SEO title="Shop Premium Streetwear" description="Shop Zenvor heavyweight tees, oversized fits, drop shoulder silhouettes, and premium Sri Lankan streetwear." canonicalPath="/shop" />
      <div className="pt-24 md:pt-40 pb-24 md:pb-40 px-4 md:px-20 lg:px-32 max-w-[1800px] mx-auto">
        {/* Cinematic Header */}
        <div className="relative mb-20 md:mb-32">
          <div className="flex flex-col space-y-4 md:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-black text-brand-gold">ARCHIVE RELEASES</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-[8vw] lg:text-[7vw] font-display font-black leading-[0.9] tracking-[-0.03em] md:tracking-[-0.05em] uppercase text-white"
            >
              THE STUDIO<span className="text-brand-gold">.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-brand-subtext text-sm md:text-lg lg:text-2xl font-light italic max-w-2xl leading-relaxed"
            >
              Curated architectural pieces for the modern movement. Season 01 drop now available for acquisition.
            </motion.p>
          </div>
        </div>

        {/* Minimalist Toolbar */}
        <div className="sticky top-16 md:top-20 z-40 bg-brand-charcoal/80 backdrop-blur-3xl border-y border-white/5 py-6 md:py-8 mb-10 md:mb-20 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 px-4 md:px-0">
          <div className="grid grid-cols-2 md:flex md:flex-row justify-items-center items-center gap-x-4 gap-y-4 md:gap-12 w-full md:w-auto">
             {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-black transition-all duration-500 whitespace-nowrap px-2 pb-1 ${
                    selectedCategory === cat ? 'text-brand-gold' : 'text-brand-subtext hover:text-white'
                  }`}
                >
                  {cat}
                  {selectedCategory === cat && (
                    <motion.div 
                      layoutId="cat-underline"
                      className="absolute -bottom-1 md:-bottom-4 left-0 right-0 h-0.5 bg-brand-gold" 
                    />
                  )}
                </button>
             ))}
          </div>

          <div className="flex items-center justify-center space-x-8 md:space-x-12 w-full md:w-auto pt-4 md:pt-0 border-t border-white/5 md:border-none">
            <button 
              id="filter-trigger"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center space-x-3 md:space-x-4 text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-black text-white hover:text-brand-gold transition-colors"
            >
              <Filter size={14} strokeWidth={2.5} />
              <span>Filters</span>
            </button>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black text-brand-subtext">{filteredProducts.length} Artifacts</span>
          </div>
        </div>

        {/* Filter Overlay */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-20 p-12 bg-brand-graphite border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-16"
            >
              <div className="space-y-8 text-center md:text-left">
                <h4 className="text-[10px] uppercase tracking-widest font-black text-brand-gold">Chromatics</h4>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {['#080808', '#1A1A1A', '#F5F5F0', '#D4C5B9', '#AF9B60'].map(color => (
                    <button key={color} className="w-8 h-8 rounded-full border border-white/10 hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              <div className="space-y-8 text-center md:text-left">
                <h4 className="text-[10px] uppercase tracking-widest font-black text-brand-gold">Sorting Protocol</h4>
                <div className="flex flex-col space-y-4">
                   <button className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-subtext hover:text-white text-left">Price: High to Low</button>
                   <button className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-subtext hover:text-white text-left">Price: Low to High</button>
                   <button className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-off-white text-left">Newest Arrivals</button>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                 <button onClick={() => setIsFilterOpen(false)} className="premium-btn w-full">Apply Configuration</button>
                 <button onClick={() => { setSelectedCategory('All'); setIsFilterOpen(false); }} className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-subtext hover:text-brand-off-white mt-4">Reset Archive</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="mb-8 border border-brand-gold/20 bg-brand-gold/5 px-5 py-4 text-[10px] uppercase tracking-[0.22em] text-brand-subtext">
            Live archive unavailable. Showing the curated local collection.
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-12 gap-y-12 md:gap-y-24">
          <AnimatePresence mode='popLayout'>
            {loading && (
               <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-6">
                 <div className="w-12 h-12 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
                 <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-subtext animate-pulse">Synchronizing Archive...</p>
               </div>
            )}
            {!loading && filteredProducts.map((product, i) => (
              <motion.div 
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Cinematic Loader / Empty State */}
        {!loading && filteredProducts.length === 0 && (
           <div className="py-40 text-center space-y-8">
              <h3 className="text-4xl font-display font-black uppercase text-brand-subtext">Archive Empty.</h3>
              <p className="text-xs uppercase tracking-[0.5em] text-brand-subtext/40">Broaden your search criteria</p>
              <button onClick={() => setSelectedCategory('All')} className="premium-btn-outline mx-auto">Reload Archive</button>
           </div>
        )}

        <div className="mt-40 text-center">
           <p className="text-[10px] uppercase tracking-[0.6em] font-black text-brand-subtext mb-12 italic opacity-40">Artifacts deployed globally</p>
           <button className="premium-btn-outline px-20">
             Load More Content
           </button>
        </div>
      </div>
    </div>
  );
}
