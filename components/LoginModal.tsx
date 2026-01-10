
import React, { useState, useEffect } from 'react';
import { X, Mail, Fingerprint, ShieldCheck, User, Loader2, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { ShadowButton } from './ShadowButton';
import { NexusLogo } from './NexusLogo';
import { User as NexusUser } from '../types';
import { LANGUAGES } from '../constants';
import { supabase } from '../services/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'EN' | 'CN' | 'MY';
  onLogin: (user: NexusUser) => void;
  onCreateId: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, lang, onLogin, onCreateId }) => {
  const [stage, setStage] = useState<1 | 2>(2); // 1 = Activation (Signup), 2 = Handshake (Login)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  
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
      setError(null);
      setShake(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...formData.pin];
    newPin[index] = value.slice(-1);
    setFormData({ ...formData, pin: newPin });
    if (value && index < 3) {
      document.getElementById(`login-pin-${index + 1}`)?.focus();
    }
  };

  const triggerError = (msg: string) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (stage === 1 && !privacyAccepted) return triggerError("Handshake requires Privacy Agreement");
    if (formData.pin.some(d => d === '')) return triggerError("4-Digit Security PIN required");
    if (parseInt(captchaInput) !== captcha.result) {
      generateCaptcha();
      return triggerError("Neural verification failed (CAPTCHA)");
    }

    setLoading(true);
    setError(null);

    const pinString = formData.pin.join('');
    // Create a deterministic secure password for Supabase from their PIN
    const securePassword = `nexus_auth_v2_${pinString}_${formData.email.split('@')[0]}`;

    try {
      if (stage === 1) {
        // --- SIGNUP FLOW ---
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: securePassword,
          options: {
            data: {
              nexus_id: formData.nexusId,
              full_name: formData.name,
              avatar_id: Math.floor(Math.random() * 10) + 1
            }
          }
        });

        if (signUpError) throw signUpError;
        if (data.user) {
          // Initialize public.profiles table
          await supabase.from('profiles').insert({
            id: data.user.id,
            nexus_id: formData.nexusId,
            points: 15,
            is_premium: false,
            avatar_id: data.user.user_metadata.avatar_id
          });

          onLogin({
            id: data.user.id,
            nexusId: formData.nexusId,
            email: formData.email,
            points: 15,
            isPremium: false,
            registrationDate: new Date().toISOString(),
            avatarId: data.user.user_metadata.avatar_id
          });
          onClose();
        }
      } else {
        // --- LOGIN FLOW ---
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: securePassword,
        });

        if (signInError) throw signInError;
        if (data.user) {
          onLogin({
            id: data.user.id,
            nexusId: data.user.user_metadata.nexus_id || 'EliteNode',
            email: data.user.email!,
            points: 1250, 
            isPremium: false,
            registrationDate: data.user.created_at,
            avatarId: data.user.user_metadata.avatar_id || 1
          });
          onClose();
        }
      }
    } catch (err: any) {
      triggerError(err.message || "Nexus synchronization failed");
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose}></div>
      <div className={`relative w-full max-w-md glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in duration-500 ${shake ? 'animate-shake' : ''}`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>
        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <NexusLogo size="md" />
            <h3 className="text-xl font-orbitron font-bold">{stage === 1 ? t.common.activation : t.common.login}</h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Supabase Genesis Link Active</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {stage === 1 && (
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-1">Operator Identity</label>
                  <div className="relative">
                    <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-10 py-3 text-sm focus:outline-none focus:border-blue-500/50 text-white" />
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-1">Network Email</label>
                <div className="relative">
                  <input required type="email" placeholder="nexus@operator.ai" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-10 py-3 text-sm focus:outline-none focus:border-blue-500/50 text-white" />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                </div>
              </div>

              {stage === 1 && (
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-1">Unique Node ID</label>
                  <div className="relative">
                    <input required type="text" placeholder="CyberPunter_2025" value={formData.nexusId} onChange={e => setFormData({...formData, nexusId: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-10 py-3 text-sm focus:outline-none focus:border-blue-500/50 text-white" />
                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-1 text-center block">Access PIN (4 Digits)</label>
                <div className="flex gap-3 justify-center">
                  {formData.pin.map((digit, i) => (
                    <input 
                      key={i} 
                      id={`login-pin-${i}`} 
                      type="password" 
                      maxLength={1} 
                      value={digit} 
                      onChange={e => handlePinChange(i, e.target.value)} 
                      className="w-12 h-14 bg-black/40 border border-white/10 rounded-xl text-center text-xl font-orbitron font-bold text-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                    />
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 font-orbitron uppercase tracking-widest">Verify: {captcha.a} + {captcha.b} =</span>
                <input required type="number" placeholder="?" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} className="w-16 bg-black/40 border border-white/10 rounded-lg py-1 px-2 text-center text-xs focus:border-blue-500 text-white" />
                <button type="button" onClick={generateCaptcha} className="text-slate-600 hover:text-white transition-colors"><RefreshCw size={12} /></button>
              </div>
            </div>

            {stage === 1 && (
              <div className="px-1 py-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1" checked={privacyAccepted} onChange={e => setPrivacyAccepted(e.target.checked)} />
                  <span className="text-[10px] font-medium text-slate-400 leading-tight group-hover:text-slate-300 transition-colors">Accept Terms of Synchronization and Data Integrity Protocols.</span>
                </label>
              </div>
            )}

            <div className="flex items-center justify-between px-1 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Remember Node</span>
              </label>
              <button 
                type="button" 
                onClick={() => { setStage(stage === 1 ? 2 : 1); setError(null); }} 
                className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors"
              >
                {stage === 1 ? 'Go to Login' : 'Go to Activation'}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 animate-in slide-in-from-top-1">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={14} />
                <p className="text-[10px] font-bold text-red-200 uppercase tracking-tighter">{error}</p>
              </div>
            )}

            <ShadowButton variant="primary" className="w-full py-4 flex items-center justify-center gap-3" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Fingerprint size={18} />}
              <span className="font-orbitron tracking-widest text-[10px] uppercase font-bold">{loading ? 'Calibrating...' : (stage === 1 ? t.common.activation : t.common.login)}</span>
              <ArrowRight size={16} />
            </ShadowButton>
          </form>
        </div>
      </div>
    </div>
  );
};
