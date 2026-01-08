
import React, { useState, useEffect } from 'react';
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
import { MOCK_SELLERS } from '../constants';

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

  // Seller Key-In Form State
  const [newTerminal, setNewTerminal] = useState<Omit<Seller, 'id' | 'coordinates'>>({
    name: '',
    address: '',
    country: 'Malaysia',
    zipCode: '',
    contactPerson: '',
    contactNumber: ''
  });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Auth Handshake: User: admin_jewel | Pass: 1234
    setTimeout(() => {
      if (adminCreds.user === 'admin_jewel' && adminCreds.pass === '1234') {
        setIsAuthenticated(true);
      } else {
        setError('Neural Signature Mismatch: Invalid Credentials');
      }
      setLoading(false);
    }, 1500);
  };

  const handleSellerKeyIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert("Terminal Synchronized: New seller node added to global network.");
      setNewTerminal({ name: '', address: '', country: 'Malaysia', zipCode: '', contactPerson: '', contactNumber: '' });
      setLoading(false);
    }, 1000);
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
             <h2 className="text-2xl font-orbitron font-bold">Admin Authority</h2>
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">Identity Handshake Required for Command Access</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-5">
             <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-2">Operator ID</label>
                <div className="relative">
                   <input 
                     required
                     type="text" 
                     placeholder="admin_jewel"
                     className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800"
                     value={adminCreds.user}
                     onChange={e => setAdminCreds({...adminCreds, user: e.target.value})}
                   />
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-2">Access Cipher</label>
                <div className="relative">
                   <input 
                     required
                     type="password" 
                     placeholder="••••"
                     className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-800"
                     value={adminCreds.pass}
                     onChange={e => setAdminCreds({...adminCreds, pass: e.target.value})}
                   />
                   <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                </div>
             </div>

             {error && (
               <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 animate-in slide-in-from-top-2">
                  <ShieldAlert className="text-red-500" size={14} />
                  <p className="text-[10px] font-bold text-red-200 uppercase">{error}</p>
               </div>
             )}

             <ShadowButton variant="primary" className="w-full py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2" disabled={loading}>
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <Power size={16} />}
                {loading ? 'Verifying Neural Signature...' : 'Authorize Node Access'}
             </ShadowButton>
          </form>
          
          <div className="flex items-center justify-center gap-2 opacity-40">
             <ShieldCheck size={12} className="text-slate-500" />
             <p className="text-[8px] text-center text-slate-600 uppercase font-black tracking-tighter">Nexus Ops Core &bull; Secure Environment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
            <div className="nexus-line nexus-line-purple"></div>
            Nexus Command Hub
          </h2>
          <div className="flex flex-wrap gap-4 md:gap-6 mt-4">
             {[
               { id: 'terminals', label: 'Terminal Dispatch', icon: Building },
               { id: 'approvals', label: 'Elite Escalations', icon: Crown },
               { id: 'system', label: 'System Vitals', icon: Activity }
             ].map((tab) => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)} 
                 className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all pb-2 border-b-2 ${activeTab === tab.id ? 'text-blue-500 border-blue-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
               >
                 <tab.icon size={14} />
                 {tab.label}
               </button>
             ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="hidden lg:flex flex-col items-end px-4 border-r border-white/5">
              <p className="text-[10px] font-black text-white uppercase">admin_jewel</p>
              <p className="text-[8px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1"><Sparkles size={8} /> Level 10 Authority</p>
           </div>
           <button onClick={() => setIsAuthenticated(false)} className="p-2.5 rounded-xl glass border border-white/10 text-slate-500 hover:text-red-500 transition-all flex items-center gap-2 text-[10px] font-black uppercase">
             <Power size={16} /> Logout
           </button>
        </div>
      </div>

      {activeTab === 'terminals' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4">
           <div className="lg:col-span-1 space-y-6">
              <div className="glass p-8 rounded-[2.5rem] border border-blue-500/20 bg-blue-600/5 space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-500">
                       <PlusCircle size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-orbitron font-bold">New Node Sync</h3>
                       <p className="text-[10px] text-slate-500 font-black uppercase">Key In Seller Metadata</p>
                    </div>
                 </div>

                 <form onSubmit={handleSellerKeyIn} className="space-y-4">
                    <div className="space-y-3">
                       <div className="relative group">
                          <input required placeholder="Terminal Full Name" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs focus:border-blue-500/50 outline-none text-white" value={newTerminal.name} onChange={e => setNewTerminal({...newTerminal, name: e.target.value})} />
                       </div>
                       <div className="relative group">
                          <textarea required placeholder="Global Node Address" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs focus:border-blue-500/50 outline-none h-24 text-white" value={newTerminal.address} onChange={e => setNewTerminal({...newTerminal, address: e.target.value})} />
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                          <select className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs focus:border-blue-500/50 outline-none text-slate-300" value={newTerminal.country} onChange={e => setNewTerminal({...newTerminal, country: e.target.value})}>
                             <option>Malaysia</option>
                             <option>Singapore</option>
                             <option>Cambodia</option>
                          </select>
                          <input required placeholder="Zip Code" className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs focus:border-blue-500/50 outline-none text-white" value={newTerminal.zipCode} onChange={e => setNewTerminal({...newTerminal, zipCode: e.target.value})} />
                       </div>
                       <div className="relative group">
                          <input required placeholder="Authority Liaison Name" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs focus:border-blue-500/50 outline-none text-white" value={newTerminal.contactPerson} onChange={e => setNewTerminal({...newTerminal, contactPerson: e.target.value})} />
                       </div>
                       <div className="relative group">
                          <input required placeholder="Emergency Contact Signal" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs focus:border-blue-500/50 outline-none text-white" value={newTerminal.contactNumber} onChange={e => setNewTerminal({...newTerminal, contactNumber: e.target.value})} />
                       </div>
                    </div>
                    <ShadowButton variant="primary" className="w-full py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2" disabled={loading}>
                       {loading ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
                       Commission Terminal
                    </ShadowButton>
                 </form>
              </div>
           </div>

           <div className="lg:col-span-2 space-y-6">
              <div className="glass p-8 rounded-[2.5rem] border border-white/5 overflow-hidden">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-orbitron font-bold flex items-center gap-3">
                       <Server className="text-slate-500" size={24} />
                       Terminal Registry
                    </h3>
                    <span className="text-[10px] font-black text-slate-500 uppercase">Total Nodes: {MOCK_SELLERS.length}</span>
                 </div>
                 <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                    {MOCK_SELLERS.map((seller) => (
                       <div key={seller.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                <Building size={24} />
                             </div>
                             <div>
                                <h4 className="font-bold text-white text-sm">{seller.name}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                   <p className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1"><MapPin size={10}/> {seller.zipCode}</p>
                                   <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                                   <p className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1"><User size={10}/> {seller.contactPerson}</p>
                                </div>
                             </div>
                          </div>
                          <button className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4">
           <div className="glass p-8 rounded-[3rem] border border-amber-500/20 bg-amber-500/5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                 <div className="flex items-center gap-4">
                    <div className="p-4 rounded-[2rem] bg-amber-500/10 text-amber-500 border border-amber-500/20">
                       <Crown size={32} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-orbitron font-bold">Quorum Escalations</h3>
                       <p className="text-xs text-slate-500 font-medium">Approve standard nodes for Nexus Elite escalation.</p>
                    </div>
                 </div>
                 <div className="px-5 py-2 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">
                    {eliteRequests.length} Pending Signatures
                 </div>
              </div>

              <div className="space-y-4">
                 {eliteRequests.length > 0 ? eliteRequests.map((req) => (
                    <div key={req.id} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-white/10 transition-all group">
                       <div className="flex items-center gap-6">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.nexusId}`} className="w-14 h-14 rounded-2xl border border-white/10 bg-black shadow-lg" alt="Node" />
                          <div className="space-y-1">
                             <p className="text-lg font-orbitron font-bold text-white group-hover:text-amber-400 transition-colors">{req.nexusId}</p>
                             <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <span>{req.email}</span>
                                <span className="text-slate-800">|</span>
                                <span>Requested: {new Date(req.timestamp).toLocaleDateString()}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex gap-3">
                          <ShadowButton variant="gold" onClick={() => onApproveElite(req.id)} className="px-6 py-3 text-[10px] font-black uppercase flex items-center gap-2">
                             <UserCheck size={16} /> Approve Access
                          </ShadowButton>
                       </div>
                    </div>
                 )) : (
                    <div className="py-20 text-center space-y-4 border-2 border-dashed border-white/5 rounded-[2rem]">
                       <ShieldCheck size={64} className="mx-auto text-slate-800" />
                       <p className="text-slate-600 font-bold uppercase tracking-[0.3em]">Handshake Queue Empty</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'system' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Uptime', value: '99.98%', icon: Signal, color: 'text-green-400' },
              { label: 'Nodes', value: '14 / 16', icon: Server, color: 'text-blue-400' },
              { label: 'Throughput', value: '8.4 GB/s', icon: CloudLightning, color: 'text-purple-400' },
              { label: 'Health', value: 'Optimal', icon: Activity, color: 'text-amber-400' },
            ].map((stat, i) => (
              <div key={i} className="glass p-6 rounded-3xl border border-white/5">
                <div className={`p-2 rounded-xl bg-white/5 w-fit ${stat.color}`}><stat.icon size={20} /></div>
                <p className="text-[10px] text-slate-500 uppercase font-black mt-4">{stat.label}</p>
                <p className="text-2xl font-orbitron font-bold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass rounded-[2rem] p-8 border border-white/5 overflow-x-auto">
               <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><Database size={22} className="text-blue-400" /> Primary Hubs</h3>
               <table className="w-full text-left min-w-[500px]">
                 <thead>
                    <tr className="text-[10px] font-black uppercase text-slate-500 border-b border-white/5">
                       <th className="pb-4 px-2">Identifier</th>
                       <th className="pb-4 px-2">Status</th>
                       <th className="pb-4 px-2">Latency</th>
                       <th className="pb-4 px-2">Load</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm">
                    {[
                      { id: 'MY-KL-01', status: 'ONLINE', latency: '42ms', load: '12%' },
                      { id: 'MY-KL-02', status: 'ONLINE', latency: '38ms', load: '24%' },
                      { id: 'SG-PO-01', status: 'ONLINE', latency: '24ms', load: '8%' },
                      { id: 'KH-PP-01', status: 'ONLINE', latency: '65ms', load: '45%' },
                    ].map((node, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                         <td className="py-4 px-2 font-mono text-xs text-slate-300">{node.id}</td>
                         <td className="py-4 px-2">
                            <span className={`text-[10px] font-black px-2 py-1 rounded bg-green-500/10 ${node.status === 'ONLINE' ? 'text-green-500' : 'text-amber-500'}`}>{node.status}</span>
                         </td>
                         <td className="py-4 px-2 font-mono text-xs text-slate-500">{node.latency}</td>
                         <td className="py-4 px-2">
                            <div className="flex items-center gap-2">
                               <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500" style={{ width: node.load }}></div>
                               </div>
                               <span className="text-[9px] font-bold text-slate-500">{node.load}</span>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
            <div className="glass rounded-[2rem] p-8 border border-white/5 h-[400px] flex flex-col">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-6"><Terminal size={20} className="text-blue-400" /> Live Logs</h3>
              <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px] p-4 bg-black/40 rounded-2xl border border-white/5 custom-scrollbar">
                {[
                  { time: '14:22:01', msg: 'Seller node sync successful.', type: 'info' },
                  { time: '14:21:45', msg: 'Escalation quorum reached.', type: 'success' },
                  { time: '14:18:22', msg: 'Failover triggered for HK-01.', type: 'warn' },
                  { time: '14:15:00', msg: 'Backup completed.', type: 'info' },
                  { time: '14:12:40', msg: 'Neural cache purged.', type: 'info' },
                  { time: '14:10:15', msg: 'Admin authority verified: admin_jewel.', type: 'success' },
                  { time: '14:05:01', msg: 'Global stream handshake active.', type: 'info' },
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 p-1 rounded transition-colors group">
                    <span className="text-slate-600 group-hover:text-slate-400 shrink-0">[{log.time}]</span>
                    <span className={`${log.type === 'success' ? 'text-green-500' : log.type === 'warn' ? 'text-amber-500' : 'text-blue-400'}`}>
                       {log.msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
