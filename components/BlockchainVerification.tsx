
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, Link as LinkIcon, CheckCircle2, X, Globe, Lock, Cpu } from 'lucide-react';
// Added missing import for ShadowButton
import { ShadowButton } from './ShadowButton';

export const BlockchainVerification: React.FC<{ resultId: string; onClose: () => void }> = ({ resultId, onClose }) => {
  const [step, setStep] = useState(0);
  const [hash, setHash] = useState('');

  useEffect(() => {
    // Generate a pseudo-random hash based on resultId
    const generateHash = () => {
      const chars = '0123456789abcdef';
      let res = '0x';
      for(let i=0; i<40; i++) res += chars[Math.floor(Math.random()*chars.length)];
      return res;
    };
    setHash(generateHash());

    const timers = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 1400),
      setTimeout(() => setStep(3), 2200),
      setTimeout(() => setStep(4), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [resultId]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative w-full max-w-lg glass border border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-[0_0_50px_rgba(59,130,246,0.1)] overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2.5 rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/20">
                <ShieldCheck size={24} />
             </div>
             <div>
                <h3 className="text-xl font-orbitron font-bold">Nexus Chain Integrity</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Public Ledger Verification</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-all"><X size={24}/></button>
        </div>

        <div className="space-y-4">
          <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 border ${step >= 1 ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-50'}`}>
            <div className={`p-2 rounded-xl ${step >= 1 ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-600'}`}>
              <Database size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-slate-500">Querying Genesis Node</p>
              <p className="text-xs font-mono truncate text-slate-300">ID: {resultId}</p>
            </div>
            {step >= 1 && <CheckCircle2 size={16} className="text-green-500 animate-in zoom-in" />}
          </div>

          <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 border ${step >= 2 ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-50'}`}>
            <div className={`p-2 rounded-xl ${step >= 2 ? 'bg-indigo-600/20 text-indigo-400' : 'bg-slate-800 text-slate-600'}`}>
              <LinkIcon size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-slate-500">Generating Merkle Hash</p>
              <p className="text-[10px] font-mono truncate text-slate-400">{hash.substring(0, 20)}...</p>
            </div>
            {step >= 2 && <CheckCircle2 size={16} className="text-green-500 animate-in zoom-in" />}
          </div>

          <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 border ${step >= 3 ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-50'}`}>
            <div className={`p-2 rounded-xl ${step >= 3 ? 'bg-purple-600/20 text-purple-400' : 'bg-slate-800 text-slate-600'}`}>
              <Globe size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-slate-500">Multi-Node Consensus</p>
              <p className="text-xs font-bold text-slate-300">Verified by 8,249 Nodes</p>
            </div>
            {step >= 3 && <CheckCircle2 size={16} className="text-green-500 animate-in zoom-in" />}
          </div>

          <div className={`flex items-center gap-4 p-5 rounded-2xl transition-all duration-700 border ${step >= 4 ? 'bg-green-600/10 border-green-500/30' : 'bg-transparent border-white/5 opacity-50'}`}>
            <div className={`p-3 rounded-2xl ${step >= 4 ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-slate-800 text-slate-600'}`}>
              <ShieldCheck size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-green-500 tracking-[0.2em]">Immutable Signature</p>
              <p className="text-sm font-bold text-white">Consensus Attained</p>
            </div>
            {step >= 4 && <div className="text-[10px] font-black bg-green-500 text-white px-2 py-1 rounded">FINALIZED</div>}
          </div>
        </div>

        <div className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-3 relative overflow-hidden group">
          <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-500 tracking-widest">
             <span>Blockchain Manifest</span>
             <Lock size={10} />
          </div>
          <p className="font-mono text-[10px] text-blue-400 break-all leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
            {hash}{hash.substring(2, 22)}
          </p>
          <div className="flex justify-between text-[8px] font-bold text-slate-600 uppercase">
             <span>Block #24,092,102</span>
             <span>Mined: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="pt-2">
           <ShadowButton onClick={onClose} variant="primary" className="w-full py-4 text-xs font-black uppercase tracking-widest">
              Acknowledge Verification
           </ShadowButton>
        </div>
      </div>
    </div>
  );
};
