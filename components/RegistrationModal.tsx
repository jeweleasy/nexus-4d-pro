
import React, { useState, useEffect } from 'react';
import { X, Mail, Fingerprint, Lock, ShieldCheck, Zap, Sparkles, Loader2, ArrowRight, ShieldAlert, KeyRound, CheckCircle2 } from 'lucide-react';
import { ShadowButton } from './ShadowButton';
import { User } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (user: User) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, onRegister }) => {
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    nexusId: '',
    pin: ['', '', '', '']
  });

  useEffect(() => {
    let timer: any;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  if (!isOpen) return null;

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...formData.pin];
    newPin[index] = value.slice(-1);
    setFormData({ ...formData, pin: newPin });
    if (value && index < 3) {
      document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  const handleVerifyChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...verificationCode];
    newCode[index] = value.slice(-1);
    setVerificationCode(newCode);
    if (value && index < 5) {
      document.getElementById(`verify-${index + 1}`)?.focus();
    }
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending email
    setTimeout(() => {
      setLoading(false);
      setStep('verify');
      setResendTimer(60);
    }, 1500);
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate Neural Link Establishment
    setTimeout(() => {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        nexusId: formData.nexusId || `Nexus_${Math.floor(Math.random() * 9999)}`,
        email: formData.email,
        points: 15,
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
                {step === 'form' ? <Fingerprint size={24} /> : <ShieldCheck size={24} />}
              </div>
              <div>
                <h3 className="text-xl font-orbitron font-bold">
                  {step === 'form' ? 'Node Activation' : 'Identity Verification'}
                </h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                  {step === 'form' ? 'General Member Registration' : 'Verifying Email Link'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-all">
              <X size={24} />
            </button>
          </div>

          {step === 'form' ? (
            <form onSubmit={handleInitialSubmit} className="space-y-6">
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
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <ShadowButton 
                  variant="primary" 
                  className="w-full py-5 flex items-center justify-center gap-3 relative overflow-hidden group"
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 size={20} className="animate-spin" /> <span className="font-orbitron tracking-widest text-xs">DISPATCHING VERIFICATION...</span></>
                  ) : (
                    <><Zap size={20} className="group-hover:text-amber-400 transition-colors" /> <span className="font-orbitron tracking-widest text-xs">INITIATE HANDSHAKE</span> <ArrowRight size={18} /></>
                  )}
                </ShadowButton>
                <p className="text-[9px] text-slate-500 text-center font-black uppercase tracking-widest">
                  Earn 15 Welcome Points on Verification
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerificationSubmit} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
               <div className="text-center space-y-2">
                 <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
                    <KeyRound className="text-amber-500" size={32} />
                 </div>
                 <p className="text-xs text-slate-400">A 6-digit verification code was sent to <br/><span className="text-blue-400 font-bold">{formData.email}</span></p>
               </div>

               <div className="space-y-4">
                  <div className="flex gap-2 justify-between">
                    {verificationCode.map((digit, i) => (
                      <input 
                        key={i}
                        id={`verify-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleVerifyChange(i, e.target.value)}
                        className="w-full h-14 bg-black/60 border border-white/10 rounded-xl text-center text-xl font-orbitron font-bold text-blue-400 focus:border-blue-500 focus:outline-none transition-all shadow-inner"
                      />
                    ))}
                  </div>
                  <div className="flex justify-center">
                    <button 
                      type="button"
                      disabled={resendTimer > 0}
                      onClick={() => setResendTimer(60)}
                      className={`text-[10px] font-black uppercase tracking-widest transition-all ${resendTimer > 0 ? 'text-slate-600' : 'text-blue-500 hover:text-blue-400 underline'}`}
                    >
                      {resendTimer > 0 ? `Resend Signal in ${resendTimer}s` : 'Resend Verification Code'}
                    </button>
                  </div>
               </div>

               <div className="space-y-4">
                  <ShadowButton 
                    variant="gold" 
                    className="w-full py-5 flex items-center justify-center gap-3"
                    disabled={loading || verificationCode.some(c => c === '')}
                  >
                    {loading ? (
                       <><Loader2 size={20} className="animate-spin" /> VERIFYING...</>
                    ) : (
                       <><CheckCircle2 size={20} /> COMPLETE ACTIVATION</>
                    )}
                  </ShadowButton>
                  <button type="button" onClick={() => setStep('form')} className="w-full text-[9px] font-black uppercase text-slate-600 hover:text-slate-400 tracking-tighter">Incorrect email? Go back</button>
               </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
