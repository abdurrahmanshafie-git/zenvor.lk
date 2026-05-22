import { motion } from 'motion/react';
import { Mail, Phone, MapPin, ArrowUpRight, Instagram, Twitter, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'CONCIERGE SERVICES',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      addToast('Complete the transmission fields.', 'error');
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      addToast('Contact intake is not configured yet.', 'error');
      return;
    }

    setIsSubmitting(true);
    const { error } = await (supabase as any).from('inquiries').insert({
      user_id: user?.id || null,
      full_name: formData.fullName,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    });
    setIsSubmitting(false);

    if (error) {
      addToast(error.message, 'error');
      return;
    }

    addToast('Transmission received.', 'success');
    setFormData({ fullName: '', email: '', subject: 'CONCIERGE SERVICES', message: '' });
  };

  return (
    <div className="bg-brand-charcoal min-h-screen">
      <div className="pt-40 pb-40 px-6 md:px-20 lg:px-40 max-w-[1800px] mx-auto">
        <div className="relative mb-32 overflow-hidden py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] font-black text-brand-gold block mb-6">COMMUNICATION HUB</span>
            <h1 className="text-6xl md:text-[10vw] font-display font-black leading-none tracking-[-0.05em] uppercase text-white mix-blend-difference">
              CONNECT<span className="text-brand-gold">.</span>
            </h1>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            {/* Context & Intel */}
            <div className="lg:col-span-4 space-y-20">
               <div className="space-y-8">
                  <h2 className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-black">LOGISTICS & INTEL</h2>
                  <div className="space-y-10">
                    <div className="group cursor-pointer">
                       <p className="text-[10px] uppercase tracking-widest text-brand-subtext mb-2">Electronic Mail</p>
                       <p className="text-lg font-black text-white group-hover:text-brand-gold transition-colors duration-500">zenvor.lk@gmail.com</p>
                    </div>
                    <div className="group cursor-pointer">
                       <p className="text-[10px] uppercase tracking-widest text-brand-subtext mb-2">Direct Audio / WhatsApp</p>
                       <a href="https://wa.me/94784757411" target="_blank" rel="noopener noreferrer" className="text-lg font-black text-white hover:text-brand-gold transition-colors duration-500 block">+94 78 475 7411</a>
                    </div>
                    <div className="group cursor-pointer">
                       <p className="text-[10px] uppercase tracking-widest text-brand-subtext mb-2">Studio Hours</p>
                       <p className="text-lg font-black text-white group-hover:text-brand-gold transition-colors duration-500">9.00 AM – 8.00 PM</p>
                    </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <h2 className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-black">STUDIO ARCHIVE HQ</h2>
                  <div className="space-y-2">
                    <p className="text-lg font-black text-white leading-tight">
                       Zenvor Studio,<br />
                       Colombo,<br />
                       Sri Lanka
                    </p>
                  </div>
               </div>

               <div className="space-y-8">
                  <h2 className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-black">SOCIETY</h2>
                  <div className="flex space-x-8">
                     <a href="https://instagram.com/zenvor.lk" target="_blank" rel="noopener noreferrer" className="text-brand-subtext hover:text-brand-gold transition-colors"><Instagram size={20} /></a>
                  </div>
               </div>
            </div>

            {/* Transmission Form */}
            <div className="lg:col-span-8">
               <div className="p-12 md:p-24 bg-brand-pitch border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                  
                  <form onSubmit={handleSubmit} className="space-y-16 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                       <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-subtext">FULL IDENTITY</label>
                          <input name="fullName" value={formData.fullName} onChange={handleChange} type="text" className="w-full bg-transparent border-b border-white/10 pb-6 outline-none focus:border-brand-gold transition-colors text-lg font-black placeholder:text-brand-subtext/20" placeholder="JULIAN VOSS" />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-subtext">VIRTUAL COORDINATES</label>
                          <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-transparent border-b border-white/10 pb-6 outline-none focus:border-brand-gold transition-colors text-lg font-black placeholder:text-brand-subtext/20" placeholder="IDENTITY@ARCHIVE.COM" />
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-subtext">TRANSMISSION SUBJECT</label>
                       <div className="relative">
                          <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-transparent border-b border-white/10 pb-6 outline-none focus:border-brand-gold transition-colors text-lg font-black appearance-none cursor-pointer">
                             <option className="bg-brand-charcoal">CONCIERGE SERVICES</option>
                             <option className="bg-brand-charcoal">ACQUISITION INQUIRY</option>
                             <option className="bg-brand-charcoal">PRESS ARCHIVE ACCESS</option>
                          </select>
                          <ChevronDown className="absolute right-0 bottom-6 text-brand-gold" size={20} />
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-subtext">MESSAGE DEPLOYMENT</label>
                       <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full bg-transparent border-b border-white/10 pb-6 outline-none focus:border-brand-gold transition-colors text-lg font-black resize-none placeholder:text-brand-subtext/20" placeholder="ESTABLISH COMMUNICATION..."></textarea>
                    </div>

                    <div className="pt-8">
                       <button type="submit" disabled={isSubmitting} className="premium-btn w-full md:w-auto h-20 px-16 flex items-center justify-center space-x-4 group disabled:opacity-50">
                          <span className="text-xs tracking-[0.4em] font-black">{isSubmitting ? 'SENDING...' : 'SEND TRANSMISSION'}</span> 
                          <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                       </button>
                    </div>
                  </form>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
