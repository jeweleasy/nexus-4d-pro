
import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Fingerprint, Lock, ShieldCheck, User, Loader2, ArrowRight, AlertCircle, CheckCircle2, Sparkles, Zap, RefreshCcw, ShieldAlert, KeyRound } from 'lucide-react';
import { ShadowButton } from './ShadowButton';
import { NexusLogo } from './NexusLogo';
import { User as NexusUser } from '../types';
import { LANGUAGES } from '../constants';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'EN' | 'CN' | 'MY';
  onLogin: (user: NexusUser) => void;
  onCreateId: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, lang, onLogin, onCreateId }) => {
  const [stage, setStage] = useState<1 | 2>(1); // 1 = Activation (Register), 2 = Handshake (Login)
  const [view, setView] = useState<'form' | 'forgot-pin' | 'reset-success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const t = LANGUAGES[lang];

  // CAPTCHA State
  const [captcha, setCaptcha] = useState({ a: 0, b: 0, result: 0 });
  const [captchaInput, setCaptchaInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nexusId: '',
    pin: ['', '', '', '']
  });

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    setCaptcha({ a, b, result: a + b });
    setCaptchaInput('');
  };

  useEffect(() => {
    if (isOpen) {
      generateCaptcha();
    } else {
      setStage(1);
      setView('form');
      setError(null);
      setShake(false);
      setFormData({ name: '', email: '', nexusId: '', pin: ['', '', '', ''] });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...formData.pin];
    newPin[index] = value.slice(-1);
    setFormData({ ...formData, pin: newPin });
    
    // Auto focus next
    if (value && index < 3) {
      const nextInput = document.getElementById(`login-pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (stage === 1 && !formData.name.trim()) return triggerError("Operator Name required");
    if (stage === 1 && !validateEmail(formData.email)) return triggerError("Invalid Network Email");
    if (!formData.nexusId.trim()) return triggerError("Unique Node ID required");
    if (formData.pin.some(d => d === '')) return triggerError("4-Digit Security PIN incomplete");
    if (parseInt(captchaInput) !== captcha.result) {
      generateCaptcha();
      return triggerError("CAPTCHA verification failed");
    }

    setLoading(true);
    setError(null);
    setShake(false);

    // Simulated node synchronization logic
    setTimeout(() => {
      // Simulation: certain IDs fail for demo purposes
      const isLoginError = stage === 2 && (formData.nexusId === 'error');
      
      if (isLoginError) {
        setLoading(false);
        triggerError("Invalid ID or Password Cluster");
        generateCaptcha();
      } else {
        const loggedUser: NexusUser = {
          id: Math.random().toString(36).substr(2, 9),
          nexusId: formData.nexusId || 'AdminNode_01',
          email: formData.email || 'operator@nexus.ai',
          points: stage === 1 ? 15 : 1250, 
          isPremium: false,
          registrationDate: new Date().toISOString().split('T')[0],
          avatarId: Math.floor(Math.random() * 10) + 1
        };
        
        if (rememberMe) {
          localStorage.setItem('nexus_remembered_id', formData.nexusId);
        }
        
        onLogin(loggedUser);
        setLoading(false);
        onClose();
      }
    }, 2000);
  };

  const triggerError = (msg: string) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleForgotPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) return triggerError("Valid email required for reset");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setView('reset-success');
    }, 1500);
  };

  if (view === 'forgot-pin') {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose}></div>
        <div className="relative w-full max-w-md glass rounded-[2.5rem] border border-white/10 p-8 space-y-8 animate-in zoom-in duration-300">
           <div className="text-center space-y-4">
             <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
                <KeyRound className="text-blue-500" size={32} />
             </div>
             <h3 className="text-xl font-orbitron font-bold">PIN Recovery</h3>
             <p className="text-xs text-slate-500">Enter your registered email to receive a secure handshake link.</p>
           </div>
           <form onSubmit={handleForgotPin} className="space-y-6">
              <div className="relative">
                <input 
                  required 
                  type="email" 
                  placeholder="operator@nexus.ai"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:border-blue-500/50"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              </div>
              <ShadowButton variant="primary" className="w-full py-4 flex items-center justify-center gap-2" disabled={loading}>
                 {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                 {loading ? 'TRANSMITTING...' : 'SEND RESET LINK'}
              </ShadowButton>
              <button type="button" onClick={() => setView('form')} className="w-full text-[10px] font-black uppercase text-slate-500 hover:text-white tracking-widest">Return to Base</button>
           </form>
        </div>
      </div>
    );
  }

  if (view === 'reset-success') {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose}></div>
        <div className="relative w-full max-w-md glass rounded-[2.5rem] border border-white/10 p-10 space-y-6 text-center animate-in zoom-in duration-300">
           <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
              <CheckCircle2 className="text-green-500" size={40} />
           </div>
           <h3 className="text-2xl font-orbitron font-bold">Transmission Sent</h3>
           <p className="text-sm text-slate-400">Check your neural mail for the 4-digit reset protocol.</p>
           <ShadowButton variant="primary" onClick={() => setView('form')} className="w-full py-4">BACK TO LOGIN</ShadowButton>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-md glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in duration-500 ${shake ? 'animate-shake' : ''}`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>
        
        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <NexusLogo size="md" />
            <div>
              <h3 className="text-xl font-orbitron font-bold">{t.common.activation}</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                {stage === 1 ? 'Establish Neural Identity' : 'Secure Handshake Protocol'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {stage === 1 && (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-1">Operator Name</label>
                    <div className="relative">
                      <input 
                        required 
                        type="text" 
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-10 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                      />
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-1">Network Email</label>
                    <div className="relative">
                      <input 
                        required 
                        type="email" 
                        placeholder="operator@nexus.ai"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-10 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                      />
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-1">Unique Node ID</label>
                <div className="relative">
                  <input 
                    required 
                    type="text" 
                    placeholder="NODE_001"
                    value={formData.nexusId}
                    onChange={(e) => setFormData({...formData, nexusId: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-10 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-1 text-center block">4-Number Security PIN</label>
                <div className="flex gap-3 justify-center">
                  {formData.pin.map((digit, i) => (
                    <input 
                      key={i}
                      id={`login-pin-${i}`}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(i, e.target.value)}
                      className="w-12 h-14 bg-black/40 border border-white/10 rounded-xl text-center text-xl font-orbitron font-bold focus:outline-none focus:border-blue-500 transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* CAPTCHA Challenge */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <ShieldAlert size={14} className="text-amber-500" />
                   <span className="text-[10px] font-bold text-slate-400 font-orbitron">{captcha.a} + {captcha.b} =</span>
                </div>
                <input 
                  type="number"
                  placeholder="?"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-16 bg-black/40 border border-white/10 rounded-lg py-1 px-2 text-center text-xs focus:outline-none focus:border-blue-500"
                />
                <button type="button" onClick={generateCaptcha} className="text-slate-600 hover:text-white transition-colors">
                  <RefreshCcw size={12} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${rememberMe ? 'bg-blue-600 border-blue-500' : 'border-white/20 group-hover:border-white/40'}`}>
                  {rememberMe && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Remember Node</span>
              </label>
              
              <div className="flex flex-col items-end gap-1">
                <button 
                  type="button" 
                  onClick={() => setStage(stage === 1 ? 2 : 1)} 
                  className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors"
                >
                  {stage === 1 ? t.common.login : t.common.activation}
                </button>
                {stage === 2 && (
                  <button type="button" onClick={() => setView('forgot-pin')} className="text-[8px] font-bold text-slate-600 uppercase hover:text-slate-400 transition-colors">Forgot PIN?</button>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={14} />
                <p className="text-[10px] font-bold text-red-200">{error}</p>
              </div>
            )}

            <div className="pt-2">
              <ShadowButton 
                variant="primary" 
                className="w-full py-4 flex items-center justify-center gap-3 relative overflow-hidden group"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span className="font-orbitron tracking-widest text-[10px] uppercase">
                      Syncing...
                    </span>
                  </>
                ) : (
                  <>
                    <Fingerprint size={18} className="group-hover:text-amber-400 transition-colors" />
                    <span className="font-orbitron tracking-widest text-[10px] uppercase">
                      {stage === 1 ? t.common.activation : t.common.login}
                    </span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                {loading && (
                  <div className="absolute inset-0 bg-blue-500/10">
                    <div className="w-full h-0.5 bg-blue-400/50 absolute animate-[scan-line_1.5s_infinite_linear]"></div>
                  </div>
                )}
              </ShadowButton>
              
              {stage === 1 && (
                <div className="mt-3 flex items-center justify-center gap-2 text-[8px] text-slate-500 font-black uppercase tracking-widest">
                  <Sparkles size={10} className="text-amber-500" />
                  <span>{t.common.welcomeBonus}</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
