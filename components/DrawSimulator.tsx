
import React, { useState } from 'react';
import { Play, X, Loader2, Sparkles, Video, ShieldCheck, Download, Activity, Tv } from 'lucide-react';
import { predictionService } from '../services/geminiService';
import { ShadowButton } from './ShadowButton';

export const DrawSimulator: React.FC<{ initialNumbers?: string; onClose: () => void }> = ({ initialNumbers = "8888", onClose }) => {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(initialNumbers);
  const [statusMsg, setStatusMsg] = useState('');

  const messages = [
    "Establishing quantum nexus link...",
    "Calibrating entropy fields...",
    "Synchronizing holographic projection...",
    "Rendering winning probabilities...",
    "Finalizing cinematic manifestation...",
    "Decrypting lucky signatures..."
  ];

  const handleSimulate = async () => {
    setLoading(true);
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      setStatusMsg(messages[msgIdx % messages.length]);
      msgIdx++;
    }, 5000);

    const url = await predictionService.generateDrawSimulation(prompt);
    
    clearInterval(msgInterval);
    setVideoUrl(url);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl glass rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600"></div>
        
        <div className="p-8 md:p-12 space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-purple-600/10 rounded-2xl text-purple-500">
                  <Video size={28} />
               </div>
               <div>
                  <h3 className="text-2xl font-orbitron font-bold">Draw Simulation Hub</h3>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Powered by VEO 3.1 Neural Rendering</p>
               </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-all"><X size={28}/></button>
          </div>

          {!videoUrl && !loading && (
            <div className="space-y-8 py-10 text-center">
               <div className="max-w-md mx-auto space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Winning Signature to Simulate</label>
                    <input 
                      type="text" 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="0000"
                      className="w-full bg-black/40 border border-white/10 rounded-3xl py-6 text-5xl font-orbitron font-black text-center tracking-[0.4em] focus:border-purple-500/50 outline-none text-white shadow-inner"
                    />
                  </div>
                  <ShadowButton onClick={handleSimulate} variant="primary" className="w-full py-5 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600">
                     <Sparkles size={20} />
                     <span className="font-orbitron tracking-widest font-black uppercase">GENERATE NEURAL SIMULATION</span>
                  </ShadowButton>
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Requires 50 Nexus Points &bull; Process takes ~30-60 seconds</p>
               </div>
            </div>
          )}

          {loading && (
            <div className="py-20 flex flex-col items-center justify-center space-y-8">
               <div className="relative">
                  <div className="w-32 h-32 border-4 border-purple-500/20 rounded-full border-t-purple-500 animate-spin"></div>
                  <Tv className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-500 animate-pulse" size={40} />
               </div>
               <div className="text-center space-y-2">
                  <p className="text-lg font-orbitron font-bold text-white tracking-widest uppercase">{statusMsg}</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Rendering Temporal Probabilities...</p>
               </div>
            </div>
          )}

          {videoUrl && (
            <div className="space-y-6 animate-in zoom-in duration-700">
               <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black">
                  <video 
                    src={videoUrl} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2">
                     <ShieldCheck size={16} className="text-green-500" />
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Nexus Verified Content</span>
                  </div>
               </div>
               <div className="flex justify-center gap-4">
                  <a 
                    href={videoUrl} 
                    download="nexus_simulation.mp4"
                    className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all"
                  >
                    <Download size={16} /> Download Manifest
                  </a>
                  <ShadowButton onClick={() => setVideoUrl(null)} variant="secondary" className="px-8 py-3 text-[10px] font-black uppercase tracking-widest">
                    New Simulation
                  </ShadowButton>
               </div>
            </div>
          )}

          <div className="pt-8 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <Activity size={16} className="text-slate-600" />
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">TEMPORAL CLUSTER V3.1 ACTIVE</span>
             </div>
             <p className="text-[9px] text-slate-700 italic">"Simulations are for visualization purposes only. Lottery outcomes are random."</p>
          </div>
        </div>
      </div>
    </div>
  );
};
