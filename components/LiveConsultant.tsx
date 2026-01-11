
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Bot, Zap, Waves, Loader2, ShieldCheck, Activity } from 'lucide-react';
import { predictionService } from '../services/geminiService';
import { ShadowButton } from './ShadowButton';

export const LiveConsultant: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rms, setRms] = useState(0);

  const sessionRef = useRef<any>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const startSession = async () => {
    setConnecting(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      inputContextRef.current = new AudioContext({ sampleRate: 16000 });
      outputContextRef.current = new AudioContext({ sampleRate: 24000 });

      const sessionPromise = predictionService.connectToLiveStrategist({
        onopen: () => {
          setIsActive(true);
          setConnecting(false);
          const source = inputContextRef.current!.createMediaStreamSource(stream);
          const processor = inputContextRef.current!.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            
            // Calculate RMS for visualizer
            let sum = 0;
            for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
            setRms(Math.sqrt(sum / inputData.length));

            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
            const pcmBase64 = encode(new Uint8Array(int16.buffer));
            
            sessionPromise.then(session => {
              session.sendRealtimeInput({ media: { data: pcmBase64, mimeType: 'audio/pcm;rate=16000' } });
            });
          };
          source.connect(processor);
          processor.connect(inputContextRef.current!.destination);
        },
        onmessage: async (msg: any) => {
          const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioData && outputContextRef.current) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputContextRef.current.currentTime);
            const buffer = await decodeAudioData(decode(audioData), outputContextRef.current, 24000, 1);
            const source = outputContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(outputContextRef.current.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }
          if (msg.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (err: any) => {
          console.error(err);
          setError("Neural link severed. Reconnecting...");
        },
        onclose: () => setIsActive(false)
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setError("Mic access denied. Enable hardware permissions.");
      setConnecting(false);
    }
  };

  const stopSession = () => {
    sessionRef.current?.close();
    inputContextRef.current?.close();
    outputContextRef.current?.close();
    setIsActive(false);
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={onClose}></div>
      <div className="relative w-full max-w-xl glass rounded-[3rem] border border-blue-500/20 p-10 space-y-8 shadow-2xl animate-in zoom-in duration-500">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className={`p-3 rounded-2xl ${isActive ? 'bg-blue-600 text-white shadow-[0_0_20px_blue]' : 'bg-slate-800 text-slate-500'}`}>
                <Bot size={28} className={isActive ? 'animate-pulse' : ''} />
             </div>
             <div>
                <h3 className="text-xl font-orbitron font-bold text-white">Live AI Strategist</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time Neural Consultation</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-all"><X size={24}/></button>
        </div>

        <div className="relative h-64 flex flex-col items-center justify-center space-y-6 overflow-hidden rounded-[2rem] bg-black/40 border border-white/5">
           {isActive ? (
             <div className="flex items-center gap-1 h-32">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 bg-blue-500 rounded-full transition-all duration-75"
                    style={{ height: `${Math.max(5, rms * 500 * (0.5 + Math.random()))}%` }}
                  ></div>
                ))}
             </div>
           ) : (
             <div className="text-center space-y-4">
                <div className="p-6 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-500 inline-block">
                   <Waves size={40} className={connecting ? 'animate-spin' : ''} />
                </div>
                <p className="text-sm font-medium text-slate-500 px-10">Initialize neural link for real-time strategy, trend analysis, and cosmic luck consultation.</p>
             </div>
           )}

           {isActive && (
             <div className="absolute bottom-4 flex items-center gap-2 px-4 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
                <ShieldCheck size={12} className="text-green-500" />
                <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Secure Uplink Established</span>
             </div>
           )}
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-xs font-bold">
             <Activity size={16} /> {error}
          </div>
        )}

        <div className="space-y-4">
           {!isActive ? (
             <ShadowButton 
               onClick={startSession} 
               disabled={connecting}
               variant="primary" 
               className="w-full py-5 flex items-center justify-center gap-3"
             >
               {connecting ? <Loader2 className="animate-spin" size={20} /> : <Mic size={20} />}
               <span className="font-orbitron tracking-widest font-black text-xs">
                 {connecting ? 'SYNCHRONIZING...' : 'ACTIVATE VOICE HANDSHAKE'}
               </span>
             </ShadowButton>
           ) : (
             <ShadowButton 
               onClick={stopSession} 
               variant="secondary" 
               className="w-full py-5 flex items-center justify-center gap-3 border-red-500/20 text-red-400"
             >
               <MicOff size={20} />
               <span className="font-orbitron tracking-widest font-black text-xs">DISCONNECT NEURAL RELAY</span>
             </ShadowButton>
           )}
           <p className="text-[9px] text-center text-slate-600 uppercase font-black leading-relaxed">
             Live consultation uses 20 Nexus Points per minute. <br/>
             Always practice responsible gaming.
           </p>
        </div>
      </div>
    </div>
  );
};
