import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PackageCheck } from 'lucide-react';
import { OrderStatus, PaymentStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { getSupabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

const statuses: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
const paymentStatuses: PaymentStatus[] = ['pending', 'paid', 'failed', 'refunded'];

export default function AdminOrders() {
  const { user, profile, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const supabase = useMemo(() => getSupabase(), []);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const loadOrders = async () => {
    setLoadingOrders(true);
    const { data, error } = await supabase!
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    if (error) addToast(error.message, 'error');
    else setOrders(data || []);
    setLoadingOrders(false);
  };

  useEffect(() => {
    if (!loading && user && profile?.role === 'admin') loadOrders();
  }, [loading, user, profile?.role]);

  if (loading) {
    return (
      <div className="bg-brand-charcoal min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  if (profile?.role !== 'admin') {
    navigate('/account', { replace: true });
    return null;
  }

  const updateStatus = async (id: string, status: OrderStatus) => {
    const { error } = await supabase!.from('orders').update({ status }).eq('id', id);
    if (error) addToast(error.message, 'error');
    else loadOrders();
  };

  const updatePaymentStatus = async (id: string, payment_status: PaymentStatus) => {
    const updates: Record<string, string> = { payment_status };
    if (payment_status === 'paid') updates.status = 'paid';
    const { error } = await supabase!.from('orders').update(updates).eq('id', id);
    if (error) addToast(error.message, 'error');
    else loadOrders();
  };

  return (
    <div className="bg-brand-charcoal min-h-screen">
      <div className="pt-24 md:pt-32 pb-24 px-4 md:px-12 lg:px-20 max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-gold mb-4">ADMIN ORDERS</p>
            <h1 className="text-4xl md:text-7xl font-display font-black uppercase tracking-tighter">ORDERS.</h1>
          </div>
          <Link to="/admin" className="premium-btn-outline h-14">Products</Link>
        </div>

        <div className="space-y-5">
          {loadingOrders && (
            <div className="bg-brand-pitch border border-white/5 p-16 text-center text-brand-subtext">
              <div className="w-10 h-10 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin mx-auto mb-5" />
              Loading orders...
            </div>
          )}
          {!loadingOrders && orders.map((order) => (
            <div key={order.id} className="bg-brand-pitch border border-white/5 p-5 md:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div>
                  <p className="text-lg font-black tracking-widest text-white">{order.order_number}</p>
                  <p className="text-[10px] uppercase tracking-widest text-brand-subtext mt-2">{order.customer_name} / {order.customer_phone} / {order.customer_email}</p>
                  <p className="text-[10px] uppercase tracking-widest text-brand-gold mt-3">LKR {Number(order.total).toFixed(2)} / {order.payment_method}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)} className="admin-field lg:w-56">
                    {statuses.map((status) => <option key={status} value={status}>{status.toUpperCase()}</option>)}
                  </select>
                  <select value={order.payment_status} onChange={(e) => updatePaymentStatus(order.id, e.target.value as PaymentStatus)} className="admin-field lg:w-56">
                    {paymentStatuses.map((status) => <option key={status} value={status}>{status.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {(order.order_items || []).map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 border border-white/5 p-3">
                    <img src={item.image_url} alt={item.product_name} loading="lazy" className="w-12 aspect-[3/4] object-cover bg-brand-graphite" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-white">{item.product_name}</p>
                      <p className="text-[9px] uppercase tracking-widest text-brand-subtext">Size {item.selected_size} / Qty {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!loadingOrders && orders.length === 0 && (
            <div className="bg-brand-pitch border border-white/5 p-16 text-center text-brand-subtext">
              <PackageCheck className="mx-auto mb-4" />No orders captured yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
