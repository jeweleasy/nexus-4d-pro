
import React, { useState } from 'react';
import { X, Copy, Check, Facebook, Twitter, Send, Share2, Smartphone } from 'lucide-react';
import { LotteryResult } from '../types';
import { ShadowButton } from './ShadowButton';

interface ShareModalProps {
  result: LotteryResult | null;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ result, onClose }) => {
  if (!result) return null;

  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}?provider=${encodeURIComponent(result.provider)}&date=${result.drawDate}`;
  const shareText = `Check out the ${result.provider} results for ${result.drawDate} on 4D Nexus Pro! 1st Prize: ${result.first}`;

  const isNativeShareSupported = !!navigator.share;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: '4D Nexus Pro Result',
        text: shareText,
        url: shareUrl,
      });
    } catch (error) {
      console.debug('Native share failed or dismissed', error);
    }
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md glass rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-4 duration-300">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-orbitron font-bold flex items-center gap-3">
              <Share2 size={20} className="text-blue-500" />
              Share Result
            </h3>
            <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Shareable Result</p>
            <p className="text-sm font-bold text-white">{result.provider} &mdash; {result.drawDate}</p>
            <p className="text-xs text-slate-400 leading-relaxed">Let others know about the latest winning numbers.</p>
          </div>

          {isNativeShareSupported && (
            <div className="pt-2">
              <ShadowButton 
                variant="primary" 
                onClick={handleNativeShare} 
                className="w-full py-4 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <Smartphone size={20} />
                <span className="font-orbitron tracking-wider text-sm">System Native Share</span>
              </ShadowButton>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest px-1">Deep Link</label>
            <div className="flex gap-2">
              <input 
                readOnly 
                value={shareUrl}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
              />
              <button 
                onClick={copyToClipboard}
                className={`p-3 rounded-xl transition-all ${copied ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30'}`}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={shareOnFacebook}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#1877F2]/10 border border-[#1877F2]/20 hover:bg-[#1877F2]/20 transition-all group"
            >
              <Facebook size={24} className="text-[#1877F2] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Facebook</span>
            </button>
            <button 
              onClick={shareOnTwitter}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 hover:bg-[#1DA1F2]/20 transition-all group"
            >
              <Twitter size={24} className="text-[#1DA1F2] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Twitter</span>
            </button>
            <button 
              onClick={shareOnTelegram}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#0088cc]/10 border border-[#0088cc]/20 hover:bg-[#0088cc]/20 transition-all group"
            >
              <Send size={24} className="text-[#0088cc] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Telegram</span>
            </button>
          </div>

          <div className="pt-2">
            <ShadowButton variant="secondary" onClick={onClose} className="w-full">
              Dismiss
            </ShadowButton>
          </div>
        </div>
      </div>
    </div>
  );
};
