import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CartDrawer from '../CartDrawer';
import MagneticButton from '../MagneticButton';
import SearchModal from '../SearchModal';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isCartOpen, setIsCartOpen, itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/lookbook' },
    { name: 'Manifesto', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled ? 'h-16 md:h-16 glass-nav' : 'h-[72px] md:h-24 bg-brand-charcoal/12 backdrop-blur-[2px]'
        }`}
      >
        <div className="max-w-[1800px] mx-auto h-full px-4 sm:px-6 md:px-12 flex items-center justify-between">
          {/* Left: Nav Links */}
          <div className="hidden 2xl:flex items-center space-x-10">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative text-[10px] uppercase tracking-[0.3em] font-bold text-brand-off-white/68 hover:text-brand-off-white transition-all duration-300 after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Left: Mobile Menu Trigger & Logo */}
          <div className="flex items-center 2xl:hidden">
            <button 
              id="mobile-menu-trigger"
              className="h-10 w-10 -ml-2 text-brand-off-white hover:text-brand-gold transition-colors mr-2 flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
            <Link to="/" className="flex items-center">
              <span className="text-lg sm:text-xl md:text-2xl font-display font-black uppercase tracking-[0.28em] sm:tracking-[0.35em] text-brand-off-white">
                ZENVOR
              </span>
            </Link>
          </div>

          {/* Center: Logo (Desktop Only) */}
          <Link
            to="/"
            className="hidden 2xl:flex absolute left-1/2 -translate-x-1/2 items-center text-2xl font-display font-black uppercase tracking-[0.45em] text-brand-off-white hover:text-brand-gold transition-colors"
          >
            ZENVOR
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5 md:space-x-8">
            <div className="hidden 2xl:flex items-center space-x-10 mr-10 border-r border-white/5 pr-10">
              {navLinks.slice(2).map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative text-[10px] uppercase tracking-[0.3em] font-bold text-brand-off-white/68 hover:text-brand-off-white transition-all duration-300 after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <button onClick={() => setIsSearchOpen(true)} className="h-10 w-10 flex items-center justify-center text-brand-off-white/70 hover:text-brand-gold transition-colors">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link to={isAuthenticated ? "/account" : "/login"} className="h-10 w-10 flex items-center justify-center text-brand-off-white/70 hover:text-brand-gold transition-colors relative">
              <User size={18} strokeWidth={1.5} />
            </Link>
            <Link to="/wishlist" className="hidden sm:flex h-10 w-10 items-center justify-center text-brand-off-white/70 hover:text-brand-gold transition-colors relative">
              <Heart size={18} strokeWidth={1.5} />
              {wishlistCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-charcoal text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">{wishlistCount}</span>}
            </Link>
            <MagneticButton>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="h-10 w-10 flex items-center justify-center text-brand-off-white/70 hover:text-brand-gold transition-colors relative"
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {itemCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-charcoal text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">{itemCount}</span>}
              </button>
            </MagneticButton>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Luxury Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-charcoal z-[100] flex flex-col"
          >
            <div className="px-6 py-6 md:p-8 flex justify-between items-center h-20 md:h-24 border-b border-white/5">
            <span className="text-xl md:text-3xl font-display font-black uppercase tracking-[0.3em] md:tracking-[0.35em] text-brand-off-white">
              ZENVOR
            </span>
              <button 
                id="close-mobile-menu"
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-brand-off-white p-2"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="flex flex-col px-6 md:p-10 pt-12 md:pt-16 space-y-5 md:space-y-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (i + 1), duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.path}
                    className="text-2xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight hover:text-brand-gold transition-colors block"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto p-6 md:p-10 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-white/5">
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-brand-subtext font-bold">Inquiries</p>
                <p className="text-sm">zenvor.lk@gmail.com</p>
              </div>
              <div className="space-y-4 sm:text-right">
                <p className="text-[10px] uppercase tracking-widest text-brand-subtext font-bold">Social</p>
                <a href="https://instagram.com/zenvor.lk" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-brand-gold transition-colors block">Instagram</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
