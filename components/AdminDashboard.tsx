
import React, { useState } from 'react';
import { 
  Activity, 
  Database, 
  RefreshCw, 
  Users, 
  ShieldAlert, 
  Cpu, 
  HardDrive, 
  Terminal, 
  Power, 
  Signal, 
  AlertCircle,
  BarChart,
  Settings,
  Server,
  CloudLightning,
  Flag,
  Trash2,
  CheckCircle,
  Lock,
  KeyRound,
  Building,
  Crown,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  XCircle,
  PlusCircle,
  MapPin,
  Phone,
  User,
  Loader2,
  Sparkles
} from 'lucide-react';
import { ShadowButton } from './ShadowButton';
import { Seller, EliteRequest } from '../types';
import { supabase } from '../services/supabase';

interface AdminDashboardProps {
  eliteRequests: EliteRequest[];
  onApproveElite: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ eliteRequests, onApproveElite }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCreds, setAdminCreds] = useState({ user: '', pass: '' });
  const [activeTab, setActiveTab] = useState<'terminals' | 'approvals' | 'system'>('terminals');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const logAdminOp = async (opType: string, targetId: string, details: any = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('admin_ops').insert({
        admin_id: user.id,
        op_type: opType,
        target_id: targetId,
        details: details
      });
    } catch (err) {
      console.error("Audit ledger failure:", err);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      // In prod, check profiles.is_premium or a custom admin flag
      if (adminCreds.user === 'admin_nexus' && adminCreds.pass === '1234') {
        setIsAuthenticated(true);
        logAdminOp('ADMIN_AUTH', 'NexusAuthority', { status: 'success' });
      } else {
        setError('Neural Signature Mismatch: Invalid Admin Pulse');
      }
      setLoading(false);
    }, 1500);
  };

  const handleApprove = async (id: string) => {
    onApproveElite(id);
    await logAdminOp('ELITE_UPGRADE', id, { approvedAt: Date.now() });
    alert("Node Upgraded: Elite signal dispatched.");
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 animate-in fade-in zoom-in duration-500">
        <div className="glass p-10 rounded-[3rem] border border-blue-500/20 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full"></div>
          <div className="text-center space-y-3">
             <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse"></div>
                <div className="w-full h-full bg-blue-600/10 rounded-3xl flex items-center justify-center border border-blue-500/20 relative z-10">
                   <Lock size={40} className={`${loading ? 'animate-pulse text-blue-400' : 'text-blue-500'}`} />
                </div>
             </div>
             <h2 className="text-2xl font-orbitron font-bold">Authority Check</h2>
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Handshake required for Command Hub</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-5">
             <input required type="text" placeholder="Admin ID" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none text-white" value={adminCreds.user} onChange={e => setAdminCreds({...adminCreds, user: e.target.value})} />
             <input required type="password" placeholder="Cipher" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none text-white" value={adminCreds.pass} onChange={e => setAdminCreds({...adminCreds, pass: e.target.value})} />
             {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-500 text-center uppercase tracking-tighter">{error}</div>}
             <ShadowButton variant="primary" className="w-full py-4 text-xs font-black uppercase flex items-center justify-center gap-2" disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Power size={16} />}
                Authorize Admin Access
             </ShadowButton>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
          <div className="w-1.5 h-10 bg-purple-500 rounded-full" />
          Command Central Hub
        </h2>
        <div className="flex gap-4">
           {['terminals', 'approvals', 'system'].map((t) => (
             <button key={t} onClick={() => setActiveTab(t as any)} className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === t ? 'text-purple-400 border-purple-400' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>{t}</button>
           ))}
        </div>
      </div>

      <div className="glass p-10 rounded-[3rem] border border-white/5 bg-white/5">
         {activeTab === 'approvals' ? (
           <div className="space-y-6">
              {eliteRequests.length > 0 ? eliteRequests.map(req => (
                <div key={req.id} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500"><Crown size={24}/></div>
                      <div>
                         <p className="font-orbitron font-bold text-white uppercase">{req.nexusId}</p>
                         <p className="text-[10px] text-slate-500 uppercase">{req.email}</p>
                      </div>
                   </div>
                   <ShadowButton variant="gold" onClick={() => handleApprove(req.id)} className="px-6 py-2 text-[10px] font-black uppercase">Approve Elite</ShadowButton>
                </div>
              )) : (
                <div className="py-20 text-center opacity-30">
                   <ShieldCheck size={64} className="mx-auto mb-4" />
                   <p className="font-black uppercase tracking-widest text-xs">Activation Queue Empty</p>
                </div>
              )}
           </div>
         ) : (
           <div className="py-20 text-center opacity-30">
              <Activity size={64} className="mx-auto mb-4" />
              <p className="font-black uppercase tracking-widest text-xs">Cluster Monitor Operational</p>
           </div>
         )}
      </div>
    </div>
  );
};
