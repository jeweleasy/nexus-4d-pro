
import React, { useState } from 'react';
import { X, Mail, Fingerprint, Lock, ShieldCheck, Zap, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { ShadowButton } from './ShadowButton';
import { User } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (user: User) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, onRegister }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    nexusId: '',
    pin: ['', '', '', '']
  });

  if (!isOpen) return null;

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...formData.pin];
    newPin[index] = value.slice(-1);
    setFormData({ ...formData, pin: newPin });
    
    // Auto focus next
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate Neural Link Establishment
    setTimeout(() => {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        nexusId: formData.nexusId || `Nexus_${Math.floor(Math.random() * 9999)}`,
        email: formData.email,
        points: 15, // Updated Welcome bonus to 15 points as requested
        isPremium: false,
        registrationDate: new Date().toISOString().split('T')[0],
        avatarId: Math.floor(Math.random() * 10) + 1
      };
      onRegister(newUser);
      setLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>
        
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/20">
                <Fingerprint size={24} />
              </div>
              <div>
                <h3 className="text-xl font-orbitron font-bold">Node Activation</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">General Member Registration</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-all">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Network Email</label>
                <div className="relative">
                  <input 
                    required 
                    type="email" 
                    placeholder="nexus@operator.ai"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Unique Nexus ID</label>
                <div className="relative">
                  <input 
                    required 
                    type="text" 
                    placeholder="CyberPunter_2025"
                    value={formData.nexusId}
                    onChange={(e) => setFormData({...formData, nexusId: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">4-Digit Neural PIN</label>
                <div className="flex gap-4 justify-between">
                  {formData.pin.map((digit, i) => (
                    <input 
                      key={i}
                      id={`pin-${i}`}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(i, e.target.value)}
                      className="w-full h-16 bg-black/40 border border-white/10 rounded-2xl text-center text-2xl font-orbitron font-bold focus:outline-none focus:border-blue-500 transition-all"
                    />
                  ))}
                </div>
                <p className="text-[9px] text-slate-600 italic px-1">Used for result confirmation and point redemptions.</p>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <ShadowButton 
                variant="primary" 
                className="w-full py-5 flex items-center justify-center gap-3 relative overflow-hidden group"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span className="font-orbitron tracking-widest text-xs">ESTABLISHING LINK...</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} className="group-hover:text-amber-400 transition-colors" />
                    <span className="font-orbitron tracking-widest text-xs">ACTIVATE MEMBER NODE</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                {loading && (
                  <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-blue-400/50 absolute animate-[scan-line_1.5s_infinite_linear]"></div>
                  </div>
                )}
              </ShadowButton>
              
              <div className="flex items-center justify-center gap-2 text-[9px] text-slate-500 font-black uppercase tracking-widest">
                <Sparkles size={12} className="text-amber-500" />
                <span>Earn 15 Welcome Points on Sync</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
