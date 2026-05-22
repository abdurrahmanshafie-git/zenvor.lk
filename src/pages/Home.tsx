import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Headphones, RefreshCcw, Ruler, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import MagneticButton from '../components/MagneticButton';
import SafeImage from '../components/SafeImage';
import { PRODUCTS } from '../data';
import { useFeaturedProducts } from '../hooks/useProducts';
import SEO from '../components/SEO';

const trustItems = [
  { icon: Truck, title: 'Islandwide Delivery', copy: '2-4 working days across Sri Lanka' },
  { icon: ShieldCheck, title: 'Secure Checkout', copy: 'Protected account and order flow' },
  { icon: Ruler, title: 'Size Support', copy: 'Fit guidance before and after purchase' },
  { icon: RefreshCcw, title: 'Exchange Policy', copy: '7-day fit exchange support' },
  { icon: Headphones, title: 'WhatsApp Support', copy: 'Direct studio assistance' },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const { featuredProducts } = useFeaturedProducts();
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : PRODUCTS.slice(0, 4);

  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.42], [1, 0.18]);
  const textScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.97]);

  return (
    <div className="relative bg-brand-charcoal overflow-hidden">
      <SEO canonicalPath="/" />

      <section className="relative min-h-[92svh] md:min-h-[102vh] w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity, scale: 1.04 }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(5,5,5,0.2)_0%,rgba(5,5,5,0.08)_38%,rgba(8,8,8,0.96)_100%)]" />
          <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(5,5,5,0.62)_0%,transparent_45%,rgba(5,5,5,0.5)_100%)]" />
          <SafeImage src="/images/hero-zenvor.png" alt="Zenvor campaign" loading="eager" decoding="async" className="hidden md:block w-full h-full object-cover object-center grayscale-[0.08]" />
          <SafeImage src="/images/mobile-hero.png" alt="Zenvor campaign mobile" loading="eager" decoding="async" className="block md:hidden w-full h-full object-cover object-center grayscale-[0.08]" />
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 z-[12] h-36 bg-[linear-gradient(180deg,transparent,rgba(8,8,8,0.96))]" />

        <div className="relative z-20 w-full px-4 sm:px-6 md:px-20 pt-20 md:pt-28">
          <motion.div
            style={{ scale: textScale }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-6xl text-center"
          >
            <motion.p initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25, duration: 0.7 }} className="editorial-eyebrow mb-5 md:mb-8">
              Season 01 / Luxury Essentials
            </motion.p>

            <h1 className="text-[18vw] sm:text-[16vw] md:text-[11vw] lg:text-[9vw] font-display font-black leading-none uppercase text-white mix-blend-difference">
              ZENVOR
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}
              className="mx-auto mt-5 md:mt-7 max-w-2xl text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.24em] md:tracking-[0.36em] font-bold text-brand-champagne/86 leading-loose"
            >
              Premium modern streetwear built in heavyweight cotton, quiet structure, and cinematic restraint.
            </motion.p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-9 md:mt-12 w-full max-w-[310px] sm:max-w-none mx-auto">
              <MagneticButton>
                <Link to="/shop" className="premium-btn w-full sm:w-auto min-w-[240px]">
                  Explore Drop 01
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link to="/lookbook" className="premium-btn-outline w-full sm:w-auto min-w-[240px] gap-3">
                  <span>View Lookbook</span>
                  <ArrowRight size={14} />
                </Link>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-30 -mt-6 md:-mt-16 px-4 md:px-6">
        <div className="max-w-[1500px] mx-auto bg-brand-graphite/82 backdrop-blur-3xl border border-white/8 fashion-frame">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {trustItems.map((item) => (
              <div key={item.title} className="min-h-32 border border-white/8 p-4 sm:p-5 md:p-7 flex flex-col justify-between gap-5 md:gap-7">
                <item.icon size={18} className="shrink-0 text-brand-gold" strokeWidth={1.6} />
                <div>
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.18em] sm:tracking-[0.25em] font-black text-white leading-snug">{item.title}</p>
                  <p className="mt-2 text-[9px] sm:text-[10px] uppercase tracking-[0.08em] sm:tracking-[0.14em] text-brand-subtext leading-relaxed">{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-40 section-shell">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 md:mb-20">
          <div className="space-y-5">
            <span className="editorial-eyebrow">Now Active</span>
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-display font-black leading-[0.9] uppercase">
              The Zenith<br />Series.
            </h2>
          </div>
          <Link to="/shop" className="group flex items-center gap-5 text-[10px] uppercase tracking-[0.32em] font-black pb-4 border-b border-white/10 hover:border-brand-gold transition-all duration-300">
            <span>Acquire Pieces</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-10 xl:gap-x-12 gap-y-12 md:gap-y-20">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.06, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative bg-brand-pitch border-y border-white/6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[720px]">
          <div className="relative order-2 lg:order-1 min-h-[420px] lg:min-h-0 overflow-hidden">
            <SafeImage src="/images/2/1.png" alt="Zenvor editorial product" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-80 grayscale-[0.12]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(5,5,5,0.54))]" />
          </div>
          <div className="order-1 lg:order-2 flex items-center px-4 md:px-12 lg:px-20 py-20 md:py-28">
            <div className="max-w-xl space-y-8 md:space-y-10">
              <span className="editorial-eyebrow">Manifesto Series 01</span>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black uppercase leading-[0.92]">
                Where Form<br />Follows Silence.
              </h2>
              <p className="text-brand-subtext text-base md:text-lg font-light leading-relaxed italic">
                Zenvor creates essentials for those who lead with presence, not volume. Clean silhouettes, heavier fabric, sharper proportion.
              </p>
              <Link to="/about" className="premium-btn-outline inline-flex">
                Read Manifesto
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-40 section-shell">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          <Link to="/shop" className="group lg:col-span-7 relative overflow-hidden min-h-[480px] md:min-h-[680px] bg-brand-graphite">
            <SafeImage src="/images/1/1.png" alt="Zenvor black tee" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.035]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(5,5,5,0.78)_100%)]" />
            <div className="absolute left-5 right-5 bottom-6 md:left-10 md:right-10 md:bottom-10">
              <p className="editorial-eyebrow mb-4">Heavyweight Cotton</p>
              <h3 className="text-3xl md:text-5xl font-display font-black uppercase leading-none">Modern Essentials</h3>
            </div>
          </Link>

          <div className="lg:col-span-5 grid grid-cols-1 gap-4 md:gap-6">
            <Link to="/shop" className="group relative overflow-hidden min-h-[320px] bg-brand-graphite">
              <SafeImage src="/images/5/1.png" alt="Zenvor earth tee" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.035]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(5,5,5,0.72))]" />
              <div className="absolute left-6 right-6 bottom-6">
                <p className="text-[9px] uppercase tracking-[0.28em] font-black text-brand-gold mb-3">Earth Signature</p>
                <h3 className="text-2xl md:text-3xl font-display font-black uppercase">Soft Structure</h3>
              </div>
            </Link>
            <div className="border border-white/8 bg-white/[0.025] min-h-[320px] p-8 md:p-10 flex flex-col justify-between">
              <p className="editorial-eyebrow">Private Studio</p>
              <div>
                <h3 className="text-3xl md:text-4xl font-display font-black uppercase leading-tight">Early access to silent drops.</h3>
                <p className="mt-5 text-sm text-brand-subtext leading-relaxed">Join the inner circle for archive releases and limited collection notices.</p>
              </div>
              <Link to="/signup" className="premium-btn w-full sm:w-max">Join Circle</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
