import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please provide identity coordinates and security key', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const { profile } = await login(email, password);
      setIsSubmitting(false);
      if (profile?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/account', { replace: true });
      }
    } catch (error: any) {
      setIsSubmitting(false);
      addToast(error.message || 'Unable to authorize access', 'error');
    }
  };

  return (
    <div className="bg-brand-charcoal min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg px-6">
        <div className="bg-brand-pitch p-8 md:p-16 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10 md:mb-12 relative z-10"
          >
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-[-0.05em] uppercase text-white mb-2">ACCESS HUB.</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold">ENTER CLEARANCE CODES</p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-8 md:space-y-10 relative z-10">
            <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-subtext">IDENTITY COORDINATES (EMAIL)</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 pb-4 outline-none focus:border-brand-gold transition-colors text-base font-black placeholder:text-brand-subtext/20" 
                  placeholder="IDENTITY@ARCHIVE.COM" 
                />
            </div>
            
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-subtext">SECURITY KEY (PASSWORD)</label>
                   <span className="text-[9px] uppercase tracking-widest font-black text-brand-subtext hover:text-white cursor-pointer transition-colors">FORGOT KEY?</span>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 pb-4 outline-none focus:border-brand-gold transition-colors text-base font-black placeholder:text-brand-subtext/20" 
                  placeholder="••••••••" 
                />
            </div>

            <div className="pt-8">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="premium-btn w-full h-16 flex items-center justify-center tracking-[0.4em] disabled:opacity-50"
                >
                  {isSubmitting ? 'AUTHORIZING...' : 'AUTHORIZE ACCESS'}
                </button>
            </div>
            
            <div className="text-center pt-8 border-t border-white/5">
               <p className="text-[10px] uppercase tracking-widest font-bold text-brand-subtext">
                  Lacking clearance? <Link to="/signup" className="text-brand-gold hover:text-white transition-colors ml-2">ESTABLISH IDENTITY</Link>
               </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
