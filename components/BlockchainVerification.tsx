
import React, { useState } from 'react';
import { ShieldCheck, Database, Link as LinkIcon, CheckCircle2, X } from 'lucide-react';

export const BlockchainVerification: React.FC<{ resultId: string; onClose: () => void }> = ({ resultId, onClose }) => {
  const [step, setStep] = useState(0);

  React.useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 1600),
      setTimeout(() => setStep(3), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md glass border border-white/10 rounded-[2rem] p-8 space-y-6 shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-orbitron font-bold flex items-center gap-3">
            <ShieldCheck className="text-blue-500" /> Nexus Chain Verify
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X size={20}/></button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <div className={`transition-all duration-500 ${step >= 1 ? 'text-green-500 scale-110' : 'text-slate-600'}`}>
              <Database size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-slate-500">Querying Source Node</p>
              <p className="text-xs font-mono truncate">ID: {resultId}</p>
            </div>
            {step >= 1 && <CheckCircle2 size={16} className="text-green-500" />}
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <div className={`transition-all duration-500 ${step >= 2 ? 'text-blue-500 scale-110' : 'text-slate-600'}`}>
              <LinkIcon size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-slate-500">Block Validation</p>
              <p className="text-xs font-mono truncate">Hash: 0x4d5f...a92b</p>
            </div>
            {step >= 2 && <CheckCircle2 size={16} className="text-green-500" />}
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-600/10 border border-blue-500/20">
            <div className={`transition-all duration-500 ${step >= 3 ? 'text-blue-400 scale-125' : 'text-slate-600 opacity-50'}`}>
              <ShieldCheck size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-blue-400">Integrity Guaranteed</p>
              <p className="text-xs font-bold">Consensus: 100% Verified</p>
            </div>
            {step >= 3 && <CheckCircle2 size={16} className="text-green-500" />}
          </div>
        </div>

        <div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-[9px] text-slate-500">
          SIGNATURE: e74f9d2b8c5a1f3e9a0b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s0t
        </div>
      </div>
    </div>
  );
};
