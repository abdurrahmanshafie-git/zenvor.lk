import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { User, Package, Heart, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { getCustomerOrders } from '../lib/orders';

export default function Account() {
  const { user, profile, logout, isAuthenticated, isAdmin, loading } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    async function loadOrders() {
      if (!isAuthenticated) return;
      setOrdersLoading(true);
      setOrdersError(null);
      try {
        setOrders(await getCustomerOrders());
      } catch (error: any) {
        setOrdersError(error.message || 'Unable to load orders.');
      } finally {
        setOrdersLoading(false);
      }
    }

    if (!loading) loadOrders();
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="bg-brand-charcoal min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="bg-brand-charcoal min-h-screen">
      <div className="pt-24 md:pt-40 pb-24 md:pb-40 px-6 md:px-20 lg:px-40 max-w-[1800px] mx-auto">
        <div className="flex flex-col space-y-6 mb-12 md:mb-24 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[10px] uppercase tracking-[0.6em] font-black text-brand-gold">PRIVATE CLEARANCE</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-[6vw] font-display font-black leading-none tracking-[-0.05em] uppercase text-white"
          >
            ACCOUNT<span className="text-brand-gold">.</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
            <div className="space-y-8 lg:col-span-1">
              <div className="bg-brand-pitch p-8 border border-white/5 space-y-6">
                 <div className="h-16 w-16 bg-brand-graphite rounded-full flex items-center justify-center border border-brand-gold/30">
                    <User size={24} className="text-brand-gold" />
                 </div>
                 <div>
                    <h2 className="text-xl font-black uppercase text-white">{profile?.full_name || user.user_metadata?.full_name || 'Zenvor Member'}</h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-subtext mt-1">{profile?.email || user.email}</p>
                 </div>
              </div>
              <div className="flex flex-col space-y-2">
                 <button className="flex items-center space-x-4 text-[10px] uppercase tracking-[0.3em] font-black text-white hover:text-brand-gold transition-colors py-4 px-6 bg-brand-pitch/50 border border-white/5">
                    <Package size={16} /> <span>Order Archives</span>
                 </button>
                 <Link to="/wishlist" className="flex items-center space-x-4 text-[10px] uppercase tracking-[0.3em] font-black text-brand-subtext hover:text-white transition-colors py-4 px-6 border border-transparent">
                    <Heart size={16} /> <span>Saved Items ({wishlistCount})</span>
                 </Link>
                 {isAdmin && (
                   <Link to="/admin" className="flex items-center space-x-4 text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold hover:text-white transition-colors py-4 px-6 border border-brand-gold/20">
                      <Package size={16} /> <span>Admin Console</span>
                   </Link>
                 )}
                 <button onClick={handleLogout} className="w-full flex items-center space-x-4 text-[10px] uppercase tracking-[0.3em] font-black text-brand-subtext hover:text-red-500 transition-colors py-4 px-6 border border-transparent mt-8">
                    <LogOut size={16} /> <span>Terminate Session</span>
                 </button>
              </div>
           </div>

           <div className="lg:col-span-3 space-y-12 w-full">
              <h3 className="text-2xl font-display font-black uppercase tracking-tight">Recent Archives</h3>
              
              {ordersLoading && (
                <div className="bg-brand-pitch border border-white/5 p-12 text-center space-y-6">
                  <div className="w-10 h-10 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin mx-auto" />
                  <p className="text-brand-subtext text-xs uppercase tracking-[0.4em] font-black">Loading acquisitions</p>
                </div>
              )}
              {!ordersLoading && ordersError && (
                <div className="bg-brand-pitch border border-white/5 p-12 text-center space-y-6">
                  <p className="text-red-400 text-xs uppercase tracking-[0.3em] font-black">{ordersError}</p>
                </div>
              )}
              {!ordersLoading && !ordersError && orders.length === 0 && (
                <div className="bg-brand-pitch border border-white/5 p-12 text-center space-y-6">
                  <Package size={48} className="mx-auto text-brand-graphite" />
                  <p className="text-brand-subtext text-xs uppercase tracking-[0.4em] font-black">No acquisitions found</p>
                  <p className="text-[10px] text-brand-subtext/40 tracking-widest italic">Your acquisition history will deploy here</p>
                </div>
              )}
              {!ordersLoading && !ordersError && orders.map((order) => (
                <div key={order.id} className="bg-brand-pitch border border-white/5 p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-black tracking-widest text-white">{order.order_number}</p>
                      <p className="text-[10px] uppercase tracking-widest text-brand-subtext mt-2">{order.status} / {order.payment_status}</p>
                    </div>
                    <p className="text-brand-gold text-sm font-black tracking-widest">LKR {Number(order.total).toFixed(2)}</p>
                  </div>
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(order.order_items || []).map((item: any) => (
                      <div key={item.id} className="border border-white/5 p-3 text-[10px] uppercase tracking-widest text-brand-subtext">
                        {item.product_name} / Size {item.selected_size} / Qty {item.quantity}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
