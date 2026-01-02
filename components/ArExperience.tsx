
import React, { useState, useRef } from 'react';
import { Scan, X, Camera, Sparkles, RefreshCw } from 'lucide-react';
import { ShadowButton } from './ShadowButton';

export const ArExperience: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startScan = async () => {
    setScanning(true);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
      
      // Artificial delay to simulate scanning
      setTimeout(() => {
        setResult("8492");
        setScanning(false);
      }, 3000);
    } catch (e) {
      setScanning(false);
      alert("Camera access denied. Please enable for AR experience.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
      <div className="absolute top-6 right-6 z-10">
        <button onClick={handleClose} className="p-3 bg-white/10 rounded-full text-white backdrop-blur-md">
          <X size={24} />
        </button>
      </div>

      <div className="relative w-full h-full">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover opacity-50"
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          {!result && (
            <div className="relative w-72 h-48 border-4 border-blue-500/50 rounded-3xl animate-pulse">
               <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                  <div className="w-full h-1 bg-blue-500 shadow-[0_0_20px_blue] absolute animate-[scan-line_2s_infinite_linear]"></div>
                  <Scan size={48} className="text-blue-400 opacity-20" />
               </div>
            </div>
          )}

          {result && (
            <div className="glass p-10 rounded-[3rem] border border-amber-500/50 text-center space-y-4 animate-in zoom-in duration-500">
               <Sparkles className="text-amber-500 mx-auto" size={48} />
               <h3 className="text-xl font-orbitron font-bold uppercase tracking-widest text-slate-400">Winning Signature Found</h3>
               <div className="text-7xl font-orbitron font-black text-white glow-gold tracking-[0.2em]">{result}</div>
               <p className="text-xs text-slate-500 uppercase font-black">Draw #5292/24 &bull; Verified</p>
               <ShadowButton variant="primary" onClick={() => setResult(null)} className="mt-4">Scan Another</ShadowButton>
            </div>
          )}

          {!scanning && !result && (
            <div className="mt-12 space-y-4 text-center">
              <h2 className="text-2xl font-orbitron font-bold text-white">AR Ticket Reveal</h2>
              <p className="text-slate-400 text-sm max-w-xs">Point your camera at your 4D ticket to see an animated analysis and probability check.</p>
              <ShadowButton variant="gold" onClick={startScan} className="flex items-center gap-2">
                <Camera size={18} /> INITIALIZE SCANNER
              </ShadowButton>
            </div>
          )}

          {scanning && (
            <div className="mt-12 text-center space-y-4">
              <div className="flex items-center gap-3 text-blue-400 font-orbitron font-bold animate-pulse">
                <RefreshCw size={24} className="animate-spin" /> ANALYZING PATTERNS...
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.4em]">Calibrating digital entropy</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
