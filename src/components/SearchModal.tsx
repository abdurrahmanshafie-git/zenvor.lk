import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search as SearchIcon, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data';
import { useProducts } from '../hooks/useProducts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { products: dbProducts, loading } = useProducts();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof PRODUCTS>([]);
  const navigate = useNavigate();

  // Use fetched products if available, fallback to static data
  const baseProducts = dbProducts.length > 0 ? dbProducts : PRODUCTS;

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = baseProducts.filter(p => {
      // Add custom keywords for better matching as requested
      const extraKeywords = "oversized tee drop shoulder tee".toLowerCase();
      
      return (
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        (p.series && p.series.toLowerCase().includes(searchTerm)) ||
        p.colors.some(c => c.toLowerCase().includes(searchTerm)) ||
        extraKeywords.includes(searchTerm)
      );
    });
    setResults(filtered);
  }, [query]);

  const handleResultClick = (id: string) => {
    onClose();
    navigate(`/product/${id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-brand-charcoal/90 backdrop-blur-md z-[200]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-[210] bg-brand-pitch border-b border-white/10"
          >
            <div className="max-w-[1800px] mx-auto">
               <div className="flex items-center h-20 md:h-32 px-6 md:px-12 relative">
                  <SearchIcon size={18} className="text-brand-subtext mr-4 md:mr-6" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="SEARCH ARCHIVE (E.G., OVERSIZED TEE, BLACK, STUDIO)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-xs md:text-3xl font-display uppercase tracking-widest text-white placeholder:text-white/10 placeholder:text-[9px] md:placeholder:text-2xl"
                  />
                  <button onClick={onClose} className="text-white hover:text-brand-gold transition-colors p-2 md:p-4">
                     <X size={20} md:size={32} strokeWidth={1} />
                  </button>
               </div>

               <AnimatePresence>
                  {query && (
                     <motion.div 
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       exit={{ opacity: 0, height: 0 }}
                       className="border-t border-white/5 bg-brand-charcoal"
                     >
                        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-8 md:py-12">
                           <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold mb-6 md:mb-8">
                             {results.length} {results.length === 1 ? 'RESULT' : 'RESULTS'} LOCATED
                           </h3>
                           
                           {results.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                 {results.map((product) => (
                                    <div key={product.id} onClick={() => handleResultClick(product.id)} className="flex items-center space-x-4 md:space-x-6 cursor-pointer group">
                                       <div className="w-16 md:w-20 aspect-[3/4] bg-brand-graphite overflow-hidden">
                                          <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" referrerPolicy="no-referrer" />
                                       </div>
                                       <div>
                                          <h4 className="text-xs uppercase tracking-widest font-black text-white group-hover:text-brand-gold transition-colors">{product.name}</h4>
                                          <p className="text-[10px] uppercase tracking-[0.2em] text-brand-subtext mt-1">{product.category}</p>
                                          <p className="text-xs font-bold text-white mt-2">LKR {product.price}.00</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           ) : (
                              <div className="text-center py-20 flex flex-col items-center">
                                <SearchIcon size={48} className="text-brand-subtext/20 mb-6" />
                                <p className="text-brand-subtext uppercase tracking-[0.4em] font-black text-[10px] mb-2">NO ARTIFACTS LOCATED.</p>
                                <p className="text-brand-subtext/60 text-[9px] tracking-widest italic">Try adjusting your search protocol.</p>
                              </div>
                           )}
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
