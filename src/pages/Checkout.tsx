import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Lock, Truck, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { calculateOrderTotals } from '../lib/commerce';
import { createOrder, sendOrderEmailNotification } from '../lib/orders';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { addToast } = useToast();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    paymentMethod: 'cod',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const totals = calculateOrderTotals(cartItems);
  const isFreeDelivery = cartTotal >= 10000;
  const finalDelivery = totals.deliveryFee;
  const finalTotal = totals.total;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast('Please sign in before checkout.', 'error');
      navigate('/login');
      return;
    }
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.district) {
      addToast('Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const order = await createOrder(formData, cartItems, totals);
      let emailNotificationFailed = false;
      try {
        await sendOrderEmailNotification(order, formData, cartItems, totals);
      } catch (emailError) {
        console.warn('Order email notification failed after order save.', emailError);
        emailNotificationFailed = true;
      }
      clearCart();
      setIsSubmitting(false);
      addToast(
        emailNotificationFailed
          ? `Order ${order.order_number} confirmed. Our team will follow up shortly.`
          : `Order ${order.order_number} confirmed.`,
        'success'
      );
      navigate(`/order-confirmation/${order.order_number}`);
    } catch (error: any) {
      setIsSubmitting(false);
      addToast(error.message || 'Order could not be saved.', 'error');
    }
  };

  React.useEffect(() => {
    if (!user) return;
    const [firstName = '', ...rest] = (profile?.full_name || user.user_metadata?.full_name || '').split(' ');
    setFormData((prev) => ({
      ...prev,
      firstName: prev.firstName || firstName,
      lastName: prev.lastName || rest.join(' '),
      email: prev.email || profile?.email || user.email || '',
      phone: prev.phone || (profile?.phone as string | undefined) || '',
    }));
  }, [profile, user]);

  if (cartItems.length === 0) {
    return (
      <div className="bg-brand-charcoal min-h-screen py-40 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter mb-4">Cart is Empty</h2>
          <p className="text-xs uppercase tracking-widest text-brand-subtext mb-8">Add items to proceed to checkout.</p>
          <Link to="/shop" className="premium-btn inline-flex">Explore Collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-charcoal min-h-screen">
      <div className="pt-24 md:pt-32 pb-24 md:pb-40 px-4 md:px-12 lg:px-20 max-w-[1800px] mx-auto">
        <div className="mb-12">
          <Link to="/cart" className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-black text-brand-subtext hover:text-white transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Cart</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl md:text-5xl font-display font-black uppercase text-white tracking-tighter mb-8 md:mb-10">SECURE CHECKOUT</h1>
              
              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Contact Logic */}
                <div className="space-y-6">
                  <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold border-b border-white/10 pb-4">01. CONTACT COORDINATES</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="FIRST NAME *" className="w-full bg-brand-pitch border border-white/10 h-14 md:h-16 px-4 md:px-6 outline-none focus:border-brand-gold transition-colors text-xs md:text-sm font-black placeholder:text-brand-subtext uppercase tracking-widest" required />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="LAST NAME *" className="w-full bg-brand-pitch border border-white/10 h-14 md:h-16 px-4 md:px-6 outline-none focus:border-brand-gold transition-colors text-xs md:text-sm font-black placeholder:text-brand-subtext uppercase tracking-widest" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="EMAIL ADDRESS *" className="w-full bg-brand-pitch border border-white/10 h-14 md:h-16 px-4 md:px-6 outline-none focus:border-brand-gold transition-colors text-xs md:text-sm font-black placeholder:text-brand-subtext uppercase tracking-widest" required />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="MOBILE NUMBER *" className="w-full bg-brand-pitch border border-white/10 h-14 md:h-16 px-4 md:px-6 outline-none focus:border-brand-gold transition-colors text-xs md:text-sm font-black placeholder:text-brand-subtext uppercase tracking-widest" required />
                  </div>
                </div>

                {/* Delivery Logistics */}
                <div className="space-y-6">
                  <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold border-b border-white/10 pb-4">02. DELIVERY LOGISTICS</h2>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="STREET ADDRESS *" className="w-full bg-brand-pitch border border-white/10 h-14 md:h-16 px-4 md:px-6 outline-none focus:border-brand-gold transition-colors text-xs md:text-sm font-black placeholder:text-brand-subtext uppercase tracking-widest" required />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="CITY / SUBURB *" className="w-full bg-brand-pitch border border-white/10 h-14 md:h-16 px-4 md:px-6 outline-none focus:border-brand-gold transition-colors text-xs md:text-sm font-black placeholder:text-brand-subtext uppercase tracking-widest" required />
                    <select name="district" value={formData.district} onChange={handleInputChange} className="w-full bg-brand-pitch border border-white/10 h-14 md:h-16 px-4 md:px-6 outline-none focus:border-brand-gold transition-colors text-xs md:text-sm font-black text-white uppercase tracking-widest appearance-none">
                      <option value="" disabled>SELECT DISTRICT *</option>
                      <option value="Ampara">Ampara</option>
                      <option value="Anuradhapura">Anuradhapura</option>
                      <option value="Badulla">Badulla</option>
                      <option value="Batticaloa">Batticaloa</option>
                      <option value="Colombo">Colombo</option>
                      <option value="Galle">Galle</option>
                      <option value="Gampaha">Gampaha</option>
                      <option value="Hambantota">Hambantota</option>
                      <option value="Jaffna">Jaffna</option>
                      <option value="Kalutara">Kalutara</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Kegalle">Kegalle</option>
                      <option value="Kilinochchi">Kilinochchi</option>
                      <option value="Kurunegala">Kurunegala</option>
                      <option value="Mannar">Mannar</option>
                      <option value="Matale">Matale</option>
                      <option value="Matara">Matara</option>
                      <option value="Moneragala">Moneragala</option>
                      <option value="Mullaitivu">Mullaitivu</option>
                      <option value="Nuwara Eliya">Nuwara Eliya</option>
                      <option value="Polonnaruwa">Polonnaruwa</option>
                      <option value="Puttalam">Puttalam</option>
                      <option value="Ratnapura">Ratnapura</option>
                      <option value="Trincomalee">Trincomalee</option>
                      <option value="Vavuniya">Vavuniya</option>
                    </select>
                  </div>
                </div>

                {/* Payment Protocol */}
                <div className="space-y-6">
                  <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold border-b border-white/10 pb-4">03. PAYMENT PROTOCOL</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <label className={`border p-6 cursor-pointer transition-all duration-300 flex items-center justify-between ${formData.paymentMethod === 'cod' ? 'border-brand-gold bg-brand-gold/5' : 'border-white/10 hover:border-white/30'}`}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.paymentMethod === 'cod' ? 'border-brand-gold' : 'border-white/30'}`}>
                           {formData.paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-brand-gold rounded-full" />}
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] font-black text-white">Cash on Delivery</span>
                        <span className="text-[8px] bg-brand-gold text-brand-charcoal px-2 py-0.5 font-black uppercase tracking-tighter">Preferred</span>
                      </div>
                      <Truck size={18} className={formData.paymentMethod === 'cod' ? 'text-brand-gold' : 'text-brand-subtext'} />
                    </label>
                    
                    <label className={`border p-6 cursor-pointer transition-all duration-300 flex items-center justify-between ${formData.paymentMethod === 'card' ? 'border-brand-gold bg-brand-gold/5' : 'border-white/10 hover:border-white/30'}`}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.paymentMethod === 'card' ? 'border-brand-gold' : 'border-white/30'}`}>
                           {formData.paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-brand-gold rounded-full" />}
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] font-black text-white">PayHere / OnePay Ready</span>
                      </div>
                      <Lock size={18} className={formData.paymentMethod === 'card' ? 'text-brand-gold' : 'text-brand-subtext'} />
                    </label>
                  </div>
                  {formData.paymentMethod === 'card' && (
                    <div className="bg-brand-pitch border border-white/5 p-6 mt-4">
                       <p className="text-[10px] uppercase tracking-widest text-brand-subtext leading-relaxed">
                          PayHere or OnePay can be connected here when merchant keys are available. Until then, COD/manual order capture remains active.
                       </p>
                    </div>
                  )}
                </div>

                <div className="pt-8">
                  <button type="submit" disabled={isSubmitting} className="w-full premium-btn h-16 md:h-20 text-xs md:text-sm tracking-[0.2em] md:tracking-[0.4em] flex items-center justify-center space-x-4 disabled:opacity-50">
                    <span>{isSubmitting ? 'PROCESSING...' : (formData.paymentMethod === 'cod' ? 'CONFIRM ORDER' : 'PROCEED TO PAYMENT')}</span>
                    {!isSubmitting && <ChevronRight size={18} />}
                  </button>
                  <div className="flex items-center justify-center space-x-2 mt-6 text-[9px] uppercase tracking-[0.2em] font-black text-brand-subtext">
                     <ShieldCheck size={12} className="text-brand-gold" />
                     <span>Secure Encrypted Checkout</span>
                  </div>
                </div>

              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-brand-pitch border border-white/5 p-6 md:p-8 lg:p-12 sticky top-24 md:top-32">
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold mb-8">ORDER MANIFEST</h3>
              
              <div className="space-y-6 mb-10 max-h-[40vh] overflow-y-auto custom-scrollbar pr-4">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="flex space-x-6 group">
                    <div className="w-20 aspect-[3/4] bg-brand-graphite overflow-hidden relative border border-white/5">
                      <img src={item.images?.[0] || item.image} alt={item.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" referrerPolicy="no-referrer" />
                      <div className="absolute top-0 right-0 bg-brand-charcoal border-l border-b border-white/10 w-6 h-6 flex items-center justify-center text-[9px] font-black">{item.quantity}</div>
                    </div>
                    <div className="flex-1 py-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-white leading-tight mb-1">{item.name}</h4>
                        <p className="text-[9px] uppercase tracking-widest text-brand-subtext">SIZE: {item.selectedSize}</p>
                      </div>
                      <p className="text-xs font-black tracking-widest text-brand-gold">LKR {item.price * item.quantity}.00</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 border-t border-white/10 pt-8">
                <div className="flex justify-between text-[11px] uppercase tracking-widest font-black text-brand-subtext">
                  <span>SUBTOTAL</span>
                  <span className="text-white">LKR {cartTotal}.00</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-widest font-black text-brand-subtext">
                  <span>LOGISTICS</span>
                  <span className="text-white">LKR {finalDelivery}.00</span>
                </div>
                {isFreeDelivery && (
                  <div className="text-[9px] uppercase tracking-widest text-brand-gold text-right">LKR 10,000+ - Free Shipping Applied</div>
                )}
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-end pt-8 border-t border-white/10 mt-8 space-y-4 md:space-y-0">
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black text-brand-subtext">TOTAL OVERRIDE</span>
                <span className="text-2xl md:text-3xl font-display font-black text-brand-off-white tracking-tighter">LKR {finalTotal}.00</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
