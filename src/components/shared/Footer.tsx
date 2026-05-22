import { Link } from 'react-router-dom';
import { ArrowUpRight, Instagram, Mail, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import SafeImage from '../SafeImage';

const trustItems = [
  { icon: Truck, title: 'Islandwide Delivery', copy: '2-4 working days' },
  { icon: ShieldCheck, title: 'Secure Checkout', copy: 'Protected order flow' },
  { icon: MessageCircle, title: 'WhatsApp Support', copy: '+94 78 475 7411' },
  { icon: ArrowUpRight, title: 'Exchange Policy', copy: '7-day fit support' },
];

export default function Footer() {
  return (
    <footer className="bg-brand-pitch pt-20 md:pt-28 pb-10 px-4 md:px-12 border-t border-white/10 relative z-20">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-16 md:mb-24">
          {trustItems.map((item) => (
            <div key={item.title} className="border border-white/8 bg-white/[0.02] p-4 md:p-6 min-h-32 flex flex-col justify-between">
              <item.icon size={18} className="text-brand-gold" strokeWidth={1.6} />
              <div>
                <p className="text-[9px] uppercase tracking-[0.24em] font-black text-white">{item.title}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-brand-subtext">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-14 lg:gap-20 mb-20 md:mb-24">
          <div className="col-span-2 lg:col-span-4 space-y-8">
            <SafeImage src="/images/logo.png" alt="ZENVOR BRAND" className="h-14 md:h-16 w-auto invert brightness-200" referrerPolicy="no-referrer" />
            <p className="text-brand-subtext text-xs leading-relaxed max-w-sm uppercase tracking-[0.18em]">
              Luxury essentials engineered for presence. Heavyweight fabric, architectural silhouettes, and a quieter kind of confidence.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a aria-label="Instagram" href="https://instagram.com/zenvor.lk" target="_blank" rel="noopener noreferrer" className="h-10 w-10 border border-white/10 flex items-center justify-center text-brand-subtext hover:text-brand-gold hover:border-brand-gold transition-colors"><Instagram size={16} /></a>
              <a aria-label="Email" href="mailto:zenvor.lk@gmail.com" className="h-10 w-10 border border-white/10 flex items-center justify-center text-brand-subtext hover:text-brand-gold hover:border-brand-gold transition-colors"><Mail size={16} /></a>
              <a aria-label="WhatsApp" href="https://wa.me/94784757411" target="_blank" rel="noopener noreferrer" className="h-10 w-10 border border-white/10 flex items-center justify-center text-brand-subtext hover:text-brand-gold hover:border-brand-gold transition-colors"><MessageCircle size={16} /></a>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2 space-y-6">
            <h4 id="footer-shop-title" className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">Collection</h4>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-[11px] uppercase tracking-widest text-brand-off-white/78 hover:text-brand-gold transition-colors">New Drops</Link></li>
              <li><Link to="/shop" className="text-[11px] uppercase tracking-widest text-brand-off-white/78 hover:text-brand-gold transition-colors">The Studio</Link></li>
              <li><Link to="/collections" className="text-[11px] uppercase tracking-widest text-brand-off-white/78 hover:text-brand-gold transition-colors">Archive</Link></li>
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-2 space-y-6">
            <h4 id="footer-support-title" className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">Studio</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-[11px] uppercase tracking-widest text-brand-off-white/78 hover:text-brand-gold transition-colors">Contact</Link></li>
              <li><Link to="/about" className="text-[11px] uppercase tracking-widest text-brand-off-white/78 hover:text-brand-gold transition-colors">Manifesto</Link></li>
              <li><Link to="/tracking" className="text-[11px] uppercase tracking-widest text-brand-off-white/78 hover:text-brand-gold transition-colors">Order Tracking</Link></li>
              <li><Link to="/faq" className="text-[11px] uppercase tracking-widest text-brand-off-white/78 hover:text-brand-gold transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="text-[11px] uppercase tracking-widest text-brand-off-white/78 hover:text-brand-gold transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-[11px] uppercase tracking-widest text-brand-off-white/78 hover:text-brand-gold transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/privacy" className="text-[11px] uppercase tracking-widest text-brand-off-white/78 hover:text-brand-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-[11px] uppercase tracking-widest text-brand-off-white/78 hover:text-brand-gold transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-4 space-y-8">
            <h4 id="footer-news-title" className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">Inner Circle</h4>
            <div className="space-y-6">
              <p className="text-white text-base md:text-lg font-serif italic leading-relaxed">Private release notes, early access, and collection previews from the Zenvor studio.</p>
              <div className="relative group border-b border-white/20 pb-4 max-w-md">
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="w-full bg-transparent text-[10px] uppercase tracking-[0.2em] outline-none placeholder:text-white/20 focus:placeholder-transparent transition-all pr-20"
                />
                <button className="absolute right-0 bottom-4 hover:text-brand-gold transition-colors flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold">
                  <span>Join</span> <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 md:pt-12 flex flex-col md:flex-row justify-between gap-4 md:items-center text-[9px] uppercase tracking-[0.24em] md:tracking-[0.3em] text-brand-subtext font-medium">
          <p id="copyright">© 2026 ZENVOR STUDIO. ALL RIGHTS RESERVED.</p>
          <p>Premium modern streetwear / luxury essentials.</p>
        </div>
      </div>
    </footer>
  );
}
