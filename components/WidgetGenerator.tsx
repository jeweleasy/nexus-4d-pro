
import React, { useState } from 'react';
import { Copy, Check, Code, ExternalLink } from 'lucide-react';
import { ShadowButton } from './ShadowButton';

export const WidgetGenerator: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const widgetCode = `<iframe src="${window.location.origin}/widget/results" width="350" height="500" frameborder="0"></iframe>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass rounded-[2rem] p-8 space-y-6 border border-white/10">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-green-500/10 text-green-500">
          <Code size={24} />
        </div>
        <div>
          <h3 className="text-xl font-orbitron font-bold">Publisher Widget</h3>
          <p className="text-xs text-slate-500">Embed Nexus Pro results on your website</p>
        </div>
      </div>

      <div className="bg-black/40 rounded-2xl p-4 border border-white/5 font-mono text-[10px] text-blue-400 relative">
        <code className="break-all">{widgetCode}</code>
      </div>

      <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-400 font-medium">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          Responsive Layout
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          Real-time Auto-sync
        </div>
      </div>

      <ShadowButton 
        onClick={copyToClipboard}
        variant="primary" 
        className="w-full flex items-center justify-center gap-2 py-3"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? 'COPIED TO CLIPBOARD' : 'GENERATE WIDGET CODE'}
      </ShadowButton>
    </div>
  );
};
