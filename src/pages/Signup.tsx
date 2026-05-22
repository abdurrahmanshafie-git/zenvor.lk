import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, MailCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const { signup } = useAuth();
  const { addToast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast('Please complete all required fields.', 'error');
      return;
    }
    if (password.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(name, email, password);
      setVerificationEmail(email);
      setPassword('');
    } catch (error: any) {
      addToast(error.message || 'Unable to create profile', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-charcoal min-h-screen flex items-center justify-center py-24 md:py-40">
      <div className="w-full max-w-lg px-6">
        <div className="bg-brand-pitch p-8 md:p-16 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

          {verificationEmail ? (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 text-center space-y-8"
            >
              <div className="mx-auto h-20 w-20 border border-brand-gold/40 bg-brand-gold/10 flex items-center justify-center">
                <MailCheck size={34} className="text-brand-gold" strokeWidth={1.4} />
              </div>
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.42em] font-black text-brand-gold">ZENVOR ACCESS</p>
                <h1 className="text-3xl md:text-5xl font-display font-black tracking-tighter uppercase text-white">Verify your email</h1>
                <p className="mx-auto max-w-sm text-sm md:text-base text-brand-subtext leading-relaxed">
                  We’ve sent a verification link to your email. Please verify your account before logging in.
                </p>
                <p className="text-[10px] uppercase tracking-[0.22em] font-black text-white/70 break-all">{verificationEmail}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link to="/login" className="premium-btn h-14">Go to Login</Link>
                <button
                  type="button"
                  onClick={() => setVerificationEmail('')}
                  className="premium-btn-outline h-14"
                >
                  Use Another Email
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.2em] font-black text-brand-subtext">
                <CheckCircle2 size={12} className="text-brand-gold" />
                <span>Verification required before access</span>
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10 md:mb-12 relative z-10"
              >
                <h1 className="text-3xl md:text-4xl font-display font-black tracking-[-0.05em] uppercase text-white mb-2">INITIALIZE.</h1>
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold">ESTABLISH CLEARANCE</p>
              </motion.div>

              <form onSubmit={handleSignup} className="space-y-8 md:space-y-10 relative z-10">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-subtext">FULL DESIGNATION</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 pb-4 outline-none focus:border-brand-gold transition-colors text-base font-black placeholder:text-brand-subtext/20"
                    placeholder="JULIAN VOSS"
                  />
                </div>

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
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-subtext">SECURITY KEY (PASSWORD)</label>
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
                    {isSubmitting ? 'INITIALIZING...' : 'CREATE ARCHIVE PROFILE'}
                  </button>
                </div>

                <div className="text-center pt-8 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-subtext">
                    Clearance confirmed? <Link to="/login" className="text-brand-gold hover:text-white transition-colors ml-2">ACCESS HUB</Link>
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
