
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
  CheckCircle
} from 'lucide-react';
import { ShadowButton } from './ShadowButton';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'moderation'>('system');
  const [syncing, setSyncing] = useState(false);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const queue = JSON.parse(localStorage.getItem('nexus_moderation_queue') || '[]');
    setReports(queue);
  }, [activeTab]);

  const [nodes, setNodes] = useState([
    { id: 'MY-KL-01', provider: 'Magnum 4D', status: 'ONLINE', latency: '42ms', load: 12 },
    { id: 'MY-KL-02', provider: 'Sports Toto', status: 'ONLINE', latency: '38ms', load: 8 },
    { id: 'MY-KL-03', provider: 'Da Ma Cai', status: 'MAINTENANCE', latency: '-', load: 0 },
    { id: 'SG-PO-01', provider: 'Singapore Pools', status: 'ONLINE', latency: '24ms', load: 15 },
  ]);

  const [logs, setLogs] = useState([
    { time: '14:22:01', msg: 'Primary source MAGNUM sync successful.', status: 'success' },
    { time: '14:21:45', msg: 'ML Model Re-training cycle initiated.', status: 'info' },
    { time: '14:18:22', msg: 'Backup source 4D88.asia failover triggered.', status: 'warning' },
    { time: '14:15:00', msg: 'System wide backup completed.', status: 'success' },
  ]);

  const handleGlobalSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg: 'MANUAL GLOBAL SYNC COMPLETED.', status: 'success' }, ...prev]);
    }, 2000);
  };

  const clearReport = (id: string) => {
    const newReports = reports.filter(r => r.id !== id);
    setReports(newReports);
    localStorage.setItem('nexus_moderation_queue', JSON.stringify(newReports));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
            <div className="nexus-line nexus-line-purple"></div>
            Nexus Command
          </h2>
          <div className="flex gap-4 mt-2">
             <button onClick={() => setActiveTab('system')} className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'system' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-slate-500 hover:text-slate-300'}`}>System Node</button>
             <button onClick={() => setActiveTab('moderation')} className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'moderation' ? 'text-red-400 border-b-2 border-red-500' : 'text-slate-500 hover:text-slate-300'}`}>Moderation Node</button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ShadowButton onClick={handleGlobalSync} variant="primary" className="flex items-center gap-2 py-2 text-xs">
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Force Sync'}
          </ShadowButton>
        </div>
      </div>

      {activeTab === 'system' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
               <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><Database size={22} className="text-blue-400" /> Primary Nodes</h3>
               <table className="w-full text-left">
                 <thead>
                    <tr className="text-[10px] font-black uppercase text-slate-500 border-b border-white/5">
                       <th className="pb-4">Identifier</th>
                       <th className="pb-4">Status</th>
                       <th className="pb-4">Latency</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm">
                    {nodes.map((node, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0">
                         <td className="py-4 font-mono text-xs">{node.id}</td>
                         <td className={`py-4 text-[10px] font-black ${node.status === 'ONLINE' ? 'text-green-500' : 'text-amber-500'}`}>{node.status}</td>
                         <td className="py-4 font-mono text-xs text-slate-500">{node.latency}</td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
            <div className="glass rounded-[2rem] p-8 border border-white/5 h-[400px] flex flex-col">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-6"><Terminal size={20} className="text-blue-400" /> Streams</h3>
              <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs p-4 bg-black/40 rounded-2xl border border-white/5 custom-scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-4 p-2 rounded transition-colors group">
                    <span className="text-slate-600 group-hover:text-slate-400">[{log.time}]</span>
                    <span className={log.status === 'success' ? 'text-green-400' : 'text-blue-400'}>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass rounded-[2.5rem] p-8 border border-red-500/10 space-y-6 animate-in slide-in-from-bottom-4">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2 text-red-500"><Flag size={22}/> Moderation Queue</h3>
              <span className="text-[10px] font-black bg-red-500/10 text-red-500 px-3 py-1 rounded-full uppercase">{reports.length} Critical Flags</span>
           </div>
           
           {reports.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {reports.map((report, i) => (
                 <div key={i} className="p-5 rounded-[1.5rem] bg-white/5 border border-white/10 space-y-3 group hover:border-red-500/30 transition-all">
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="text-[10px] font-black uppercase text-red-500">Reported Node: {report.user}</p>
                          <p className="text-[9px] text-slate-500">Flagged by: {report.reportedBy}</p>
                       </div>
                       <p className="text-[8px] font-bold text-slate-600">{new Date(report.reportTime).toLocaleTimeString()}</p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5 italic text-xs text-slate-300">
                      "{report.text}"
                    </div>
                    <div className="flex gap-3 pt-2">
                       <button onClick={() => clearReport(report.id)} className="flex-1 py-2 rounded-xl bg-green-500/10 text-green-500 text-[9px] font-black uppercase hover:bg-green-500/20 transition-all flex items-center justify-center gap-2">
                          <CheckCircle size={14}/> Dismiss
                       </button>
                       <button onClick={() => clearReport(report.id)} className="flex-1 py-2 rounded-xl bg-red-600/10 text-red-500 text-[9px] font-black uppercase hover:bg-red-600/20 transition-all flex items-center justify-center gap-2">
                          <Trash2 size={14}/> Ban Node
                       </button>
                    </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="py-20 text-center space-y-4">
                <CheckCircle size={48} className="mx-auto text-slate-800" />
                <p className="text-slate-500 font-bold uppercase tracking-widest">Global Community Healthy &bull; All Clear</p>
             </div>
           )}
        </div>
      )}
    </div>
  );
};
