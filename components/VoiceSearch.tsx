
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Search, Loader2 } from 'lucide-react';
import { predictionService } from '../services/geminiService';

interface VoiceSearchProps {
  onCommand: (intent: string, provider: string | null) => void;
}

export const VoiceSearch: React.FC<VoiceSearchProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript;
        setTranscript(result);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    if (!isListening && transcript) {
      handleProcessCommand();
    }
  }, [isListening, transcript]);

  const handleProcessCommand = async () => {
    if (!transcript) return;
    setProcessing(true);
    const result = await predictionService.parseVoiceCommand(transcript);
    onCommand(result.intent, result.provider);
    setTranscript('');
    setProcessing(false);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={toggleListening}
        className={`flex items-center gap-3 px-4 py-2 glass border rounded-xl transition-all ${
          isListening ? 'border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-white/10 hover:border-blue-500/50'
        }`}
      >
        {processing ? (
          <Loader2 className="animate-spin text-blue-500" size={16} />
        ) : isListening ? (
          <Mic className="text-red-500 animate-pulse" size={16} />
        ) : (
          <Mic className="text-slate-400 group-hover:text-blue-400" size={16} />
        )}
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-200">
          {processing ? 'Processing...' : isListening ? 'Listening...' : 'Voice Search'}
        </span>
      </button>
      
      {transcript && isListening && (
        <div className="absolute top-full left-0 mt-2 w-64 glass p-3 rounded-xl border border-white/10 z-[60] animate-in fade-in slide-in-from-top-2">
          <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Transcript</p>
          <p className="text-xs italic text-blue-400">"{transcript}"</p>
        </div>
      )}
    </div>
  );
};
