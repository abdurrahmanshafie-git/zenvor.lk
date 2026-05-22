import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, ArrowLeft, Ruler, ShieldCheck, Truck, ChevronRight, Minus, Plus } from 'lucide-react';
import MagneticButton from '../components/MagneticButton';
import { PRODUCTS } from '../data';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { product: dbProduct, loading } = useProduct(id);
  
  // Use fetched product if available, fallback to static data
  const product = dbProduct || PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  
  const productImages = product.images || [product.image];
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(productImages[0]);
  const [quantity, setQuantity] = useState(1);

  // Sync selected image and color when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0] || product.image);
      setSelectedColor(product.colors?.[0] || '');
    }
  }, [product.id]);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      addToast('Please select a size before adding to cart', 'error');
      return;
    }
    addToCart(product, selectedSize, quantity);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
     return (
        <div className="bg-brand-charcoal min-h-screen flex flex-col items-center justify-center space-y-8 px-6">
           <div className="w-16 h-16 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
           <div className="space-y-2 text-center">
              <p className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-gold animate-pulse">Accessing Archive Data</p>
              <p className="text-brand-subtext text-[9px] uppercase tracking-widest">Constructing Digital Silhouette...</p>
           </div>
        </div>
     );
  }

  return (
    <div className="bg-brand-charcoal min-h-screen relative">
      <SEO
        title={product.seoTitle || product.name}
        description={product.seoDescription || product.description}
        canonicalPath={`/product/${product.id}`}
        image={product.image}
        product={product}
      />
      <div className="pt-24 md:pt-32 pb-24 md:pb-40 px-4 md:px-12 lg:px-20 max-w-[1800px] mx-auto">
        <div className="flex items-center justify-between mb-8 md:mb-16">
          <Link to="/shop" className="group flex items-center space-x-3 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black text-brand-subtext hover:text-brand-off-white transition-colors">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            <span>Return to Archive</span>
          </Link>
          <div className="hidden md:flex items-center space-x-2 text-[9px] uppercase tracking-widest text-brand-subtext font-bold">
            <Link to="/" className="hover:text-brand-off-white">Home</Link>
            <span className="opacity-20">/</span>
            <Link to="/shop" className="hover:text-brand-off-white">Shop</Link>
            <span className="opacity-20">/</span>
            <span className="text-brand-gold">{product.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 lg:gap-24 items-start">
          {/* Media Cluster */}
          <div className="lg:col-span-1 hidden lg:flex flex-col space-y-4">
             {productImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-[3/4] bg-brand-graphite overflow-hidden border transition-all duration-700 ${selectedImage === img ? 'opacity-100 border-brand-gold' : 'opacity-30 border-transparent hover:opacity-100'}`}
                >
                   <img src={img} alt={`${product.name} thumbnail ${i + 1}`} loading="lazy" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
             ))}
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="aspect-[3/4] bg-brand-graphite overflow-hidden relative group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  src={selectedImage} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              <div className="absolute top-8 left-8">
                 <span className="text-[10px] uppercase tracking-[0.4em] font-black py-2 px-4 bg-brand-charcoal/50 backdrop-blur-md border border-white/5 text-white">AUTHENTIC ARTIFACT</span>
              </div>
            </div>
            {/* Mobile Thumbnails */}
            <div className="flex lg:hidden space-x-4 overflow-x-auto pb-4 custom-scrollbar">
               {productImages.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImage(img)}
                    className={`flex-none w-20 aspect-[3/4] bg-brand-graphite overflow-hidden border ${selectedImage === img ? 'border-brand-gold' : 'border-white/10'}`}
                  >
                     <img src={img} alt={`${product.name} thumbnail ${i + 1}`} loading="lazy" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
               ))}
            </div>
          </div>

          {/* Configuration Space */}
          <div className="lg:col-span-5 flex flex-col space-y-12">
            <div className="space-y-6">
               <div className="space-y-4">
                  {product.series && (
                    <span className="block text-[11px] uppercase tracking-[0.5em] text-brand-gold font-black">{product.series}</span>
                  )}
                  <h1 id="product-title" className="text-3xl sm:text-4xl md:text-6xl font-display font-black leading-[0.9] tracking-[-0.03em] uppercase">
                    {product.name}
                  </h1>
                  <p id="product-price" className="text-xl md:text-3xl font-black text-brand-off-white tracking-tighter">LKR {product.price}.00</p>
               </div>
               
               <div className="h-px bg-white/5 w-full" />

               <p className="text-brand-subtext text-lg font-light leading-relaxed italic">
                 {product.description} Engineered with a signature oversized drape and double-stitched reinforcement. An essential silhouette for the modern archive.
               </p>
            </div>

            {/* Size Configuration */}
            <div className="space-y-8">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-subtext">SELECT ARCHIVE SIZE</span>
                  <button onClick={() => setIsSizeGuideOpen(true)} className="flex items-center text-[10px] uppercase tracking-widest font-black text-brand-gold hover:text-brand-off-white transition-colors">
                     <Ruler size={14} className="mr-3" /> Size Matrix
                  </button>
               </div>
               <div className="grid grid-cols-4 gap-2 md:gap-4">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 md:h-16 border text-[10px] md:text-xs font-black transition-all duration-500 uppercase tracking-widest flex items-center justify-center ${
                        selectedSize === size ? 'bg-brand-off-white text-brand-charcoal border-brand-off-white' : 'border-white/10 text-brand-subtext hover:border-brand-gold hover:text-brand-off-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
               </div>
            </div>

            {/* Color Configuration */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-6">
                 <span className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-subtext">SELECT COLOR VARIANT</span>
                 <div className="flex flex-wrap gap-4">
                    {product.colors.map(color => (
                       <button
                         key={color}
                         onClick={() => {
                            setSelectedColor(color);
                            // In a real app we'd also swap the main image if variant image exists
                         }}
                         className={`h-12 px-6 border text-[10px] font-black transition-all duration-500 uppercase tracking-widest flex items-center justify-center ${
                           selectedColor === color ? 'bg-brand-off-white text-brand-charcoal border-brand-off-white' : 'border-white/10 text-brand-subtext hover:border-brand-gold hover:text-brand-off-white'
                         }`}
                       >
                         {color}
                       </button>
                    ))}
                 </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-6 md:space-y-10 pt-4 hidden md:block">
               <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                  <div className="flex items-center justify-between border border-white/10 h-16 px-6 md:w-32">
                     <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-brand-subtext hover:text-brand-off-white transition-colors">
                        <Minus size={16} />
                     </button>
                     <span className="text-sm font-black w-4 text-center">{quantity}</span>
                     <button onClick={() => setQuantity(quantity + 1)} className="text-brand-subtext hover:text-brand-off-white transition-colors">
                        <Plus size={16} />
                     </button>
                  </div>
                  <MagneticButton className="flex-1">
                    <button onClick={handleAddToCart} className="w-full premium-btn group h-16">
                       <ShoppingBag size={18} className="mr-4 group-hover:-translate-y-1 transition-transform" /> 
                       Commit to Purchase
                    </button>
                  </MagneticButton>
               </div>
               
               <button 
                  onClick={() => toggleWishlist(product)}
                  className={`w-full h-16 border flex items-center justify-center space-x-4 text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-500 ${
                    isWishlisted ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-white/5 hover:bg-white/5 text-white'
                  }`}
               >
                  <Heart size={18} className={isWishlisted ? "fill-brand-gold" : "text-brand-gold"} />
                  <span>{isWishlisted ? 'Saved in Archive' : 'Archive in Wishlist'}</span>
               </button>
            </div>

            {/* Tech Specs */}
            <div className="grid grid-cols-2 gap-4 md:gap-8 pt-8 md:pt-10 border-t border-white/5">
                <div className="space-y-3 md:space-y-4">
                   <div className="flex items-center space-x-3">
                      <Truck size={16} className="text-brand-gold" />
                      <span className="text-[10px] uppercase tracking-widest font-black">LOGISTICS</span>
                   </div>
                   <p className="text-[10px] md:text-[11px] text-brand-subtext tracking-wide leading-relaxed">Secure local transit. Islandwide delivery within 2-4 working days (1-2 days for Colombo).</p>
                </div>
                <div className="space-y-3 md:space-y-4">
                   <div className="flex items-center space-x-3">
                      <ShieldCheck size={16} className="text-brand-gold" />
                      <span className="text-[10px] uppercase tracking-widest font-black">PROTECTION</span>
                   </div>
                   <p className="text-[10px] md:text-[11px] text-brand-subtext tracking-wide leading-relaxed">Encrypted transactional protocol. 7-day exchange mandate for sizing deviations.</p>
                </div>
            </div>
          </div>
        </div>

        {/* Detailed Spec Section */}
        <div className="mt-14 md:mt-40 pt-14 md:pt-40 border-t border-white/5">
           <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-24">
              <div className="space-y-4 md:space-y-10 group">
                 <h4 className="text-xl md:text-4xl font-display font-black uppercase tracking-tighter leading-none">FABRIC<br/>ENGINEERING.</h4>
                 <p className="text-brand-subtext text-[11px] md:text-lg font-light leading-relaxed italic opacity-70 md:opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                   {product.fabric || 'Sourced from premium architectural cotton mills.'} Every garment uses a {product.gsm ? `${product.gsm} GSM` : 'high-density'} jersey that maintains structure while preserving breathable comfort.
                 </p>
                 <div className="h-[1px] w-20 bg-brand-gold transition-all duration-700 group-hover:w-full" />
              </div>
              <div className="space-y-4 md:space-y-10 group">
                 <h4 className="text-xl md:text-4xl font-display font-black uppercase tracking-tighter leading-none">STRUCTURAL<br/>SYMMETRY.</h4>
                 <p className="text-brand-subtext text-[11px] md:text-lg font-light leading-relaxed italic opacity-70 md:opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                   The Zenvor silhouette is defined by intentional asymmetry within a structured frame. {product.fit || 'Advanced drop-shoulder ergonomics'} and box-trunk geometry define the prestige streetwear aesthetic.
                 </p>
                 <div className="h-[1px] w-20 bg-brand-gold transition-all duration-700 group-hover:w-full" />
              </div>
              <div className="col-span-2 lg:col-span-1 space-y-4 md:space-y-10 group">
                 <h4 className="text-xl md:text-4xl font-display font-black uppercase tracking-tighter leading-none">ARCHIVE<br/>LONGEVITY.</h4>
                 <p className="text-brand-subtext text-[11px] md:text-lg font-light leading-relaxed italic opacity-70 md:opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                   Constructed for the long-term curator. Double-needle cover stitching throughout. Garment dyed and pre-shrunk for an immutable fit that resists time and trends.
                 </p>
                 <div className="h-[1px] w-20 bg-brand-gold transition-all duration-700 group-hover:w-full" />
              </div>
           </div>
        </div>
        {/* Reviews Section */}
        <div className="mt-14 md:mt-20 pt-14 md:pt-20 border-t border-white/5">
           <div className="flex flex-row items-end justify-between gap-4 mb-8 md:mb-16">
             <div>
               <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tighter mb-2">FIELD REPORTS</h2>
               <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-black text-brand-gold">CUSTOMER ACQUISITION FEEDBACK</p>
             </div>
             <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-right">
               <div className="hidden sm:flex text-brand-gold">
                  {[1,2,3,4,5].map(i => <Heart key={i} size={14} className="fill-brand-gold mr-1" />)}
               </div>
               <span className="text-xs md:text-sm font-black tracking-widest text-white">4.9 / 5.0</span>
               <span className="text-[9px] md:text-xs uppercase tracking-widest text-brand-subtext">(28 REVIEWS)</span>
             </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {[
                { name: "MALIK R.", date: "OCT 12, 2026", rating: 5, text: "The architectural cut on this piece is phenomenal. Perfect drop shoulder. The 380GSM weight feels incredibly premium. Sizing down gave me the exact fit I wanted." },
                { name: "JONATHAN S.", date: "SEP 28, 2026", rating: 5, text: "Worth the investment. The fabric structure holds shape perfectly throughout the day. Islandwide delivery was remarkably fast, arrived in sterile premium packaging." },
                { name: "AARON V.", date: "SEP 15, 2026", rating: 4, text: "Beautifully engineered garment. Very oversized as stated, definitely consult the size matrix before acquiring. Construction quality is unmatched in the local market." }
              ].map((review, i) => (
                <div key={i} className="bg-brand-pitch border border-white/5 p-5 md:p-8 flex flex-col justify-between">
                   <div>
                     <div className="flex items-center justify-between mb-4 md:mb-6">
                        <span className="text-[10px] uppercase tracking-widest font-black text-white">{review.name}</span>
                        <span className="text-[9px] uppercase tracking-widest text-brand-subtext">{review.date}</span>
                     </div>
                     <div className="flex text-brand-gold mb-4 md:mb-6">
                        {[...Array(5)].map((_, idx) => <Heart key={idx} size={10} className={idx < review.rating ? "fill-brand-gold mr-1" : "text-brand-subtext mr-1"} />)}
                     </div>
                     <p className="text-[11px] md:text-xs tracking-wide text-brand-subtext leading-relaxed font-light italic">"{review.text}"</p>
                   </div>
                   <div className="mt-6 md:mt-8 pt-4 border-t border-white/5 flex items-center space-x-2 text-[9px] uppercase tracking-widest font-bold text-brand-gold">
                      <ShieldCheck size={12} />
                      <span>Verified Acquisition</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Recently Viewed Products */}
        <div className="mt-14 md:mt-20 pt-14 md:pt-20 border-t border-white/5">
          <div className="mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tighter mb-2">RECENTLY VIEWED</h2>
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.24em] md:tracking-[0.4em] font-black text-brand-gold">YOUR TRAIL THROUGH THE ARCHIVE</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-10 xl:gap-x-12 gap-y-12 md:gap-y-20">
             {PRODUCTS.filter(p => p.id !== product.id).slice(0, 4).map(p => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
             ))}
          </div>
        </div>

      </div>

      {/* Sticky Mobile Add to Cart */}
      {createPortal(
        <div className="fixed bottom-0 left-0 w-full z-[120] md:hidden bg-brand-pitch border-t border-white/10 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center gap-3 shadow-[0_-20px_40px_rgba(0,0,0,0.8)]">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase font-black tracking-widest text-white mb-1">
              {selectedSize ? `SIZE: ${selectedSize}` : 'SELECT SIZE'}
            </p>
            <p className="text-sm font-black tracking-widest text-brand-gold">LKR {product.price}.00</p>
          </div>
          <button onClick={handleAddToCart} className="flex-none h-14 min-w-[172px] bg-brand-off-white px-4 text-brand-charcoal hover:bg-brand-gold transition-colors flex items-center justify-center">
             <ShoppingBag size={14} className="mr-2 shrink-0" />
             <span className="text-[9px] uppercase tracking-[0.12em] font-black leading-none whitespace-nowrap">Commit to Purchase</span>
          </button>
        </div>,
        document.body
      )}

      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-brand-charcoal/90 backdrop-blur-sm" onClick={() => setIsSizeGuideOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-brand-pitch border border-white/10 p-8 w-full max-w-2xl relative z-10 max-h-[85vh] overflow-y-auto"
            >
              <button onClick={() => setIsSizeGuideOpen(false)} className="absolute top-6 right-6 text-brand-subtext hover:text-white transition-colors">
                <ChevronRight size={24} className="rotate-180" />
              </button>
              
              <div className="space-y-12 mt-4">
                 <div>
                    <h2 className="text-2xl font-display font-black uppercase text-white tracking-tighter mb-2">SIZE MATRIX</h2>
                    <p className="text-xs uppercase tracking-widest text-brand-subtext">ARCHITECTURAL FIT SPECIFICATIONS</p>
                 </div>
                 
                 <div className="space-y-6">
                    <p className="text-sm text-brand-subtext leading-relaxed">
                      Zenvor garments feature a signature oversized drape design. We advise taking your standard size for an engineered relaxed fit, or sizing down once for a more traditional silhouette.
                    </p>
                    <img src="/images/size-chart.png" alt="Size Chart" className="w-full h-auto border border-white/5" />
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
