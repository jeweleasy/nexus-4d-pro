
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
  CloudLightning
} from 'lucide-react';
import { ShadowButton } from './ShadowButton';

export const AdminDashboard: React.FC = () => {
  const [syncing, setSyncing] = useState(false);
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
    { time: '14:15:00', msg: 'System wide backup completed to AWS US-EAST-1.', status: 'success' },
  ]);

  const handleGlobalSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLogs(prev => [
        { time: new Date().toLocaleTimeString(), msg: 'MANUAL GLOBAL SYNC COMPLETED: 14/14 Sources Verified.', status: 'success' },
        ...prev
      ]);
    }, 2000);
  };

  const toggleNode = (index: number) => {
    setNodes(prev => prev.map((n, i) => i === index ? {
      ...n, 
      status: n.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE',
      latency: n.status === 'ONLINE' ? '-' : '40ms'
    } : n));
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
            <div className="nexus-line nexus-line-purple"></div>
            Nexus Command Center
          </h2>
          <p className="text-slate-400 text-sm mt-1">Global Data Orchestration & Node Management</p>
        </div>
        <div className="flex items-center gap-3">
          <ShadowButton onClick={handleGlobalSync} variant="primary" className="flex items-center gap-2">
            <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing Sources...' : 'Force Global Sync'}
          </ShadowButton>
          <button className="p-3 glass border border-white/10 rounded-xl hover:bg-white/10 transition-all">
             <Settings size={20} className="text-slate-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Network Uptime', value: '99.98%', icon: Signal, color: 'text-green-400' },
          { label: 'Active Edge Nodes', value: '14 / 16', icon: Server, color: 'text-blue-400' },
          { label: 'Neural Throughput', value: '8.4 GB/s', icon: CloudLightning, color: 'text-purple-400' },
          { label: 'System Health', value: 'Optimal', icon: Activity, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
               <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon size={20} />
               </div>
               <BarChart size={16} className="text-slate-700" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">{stat.label}</p>
              <p className="text-2xl font-orbitron font-bold mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass rounded-[2rem] p-8 border border-white/5 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Database size={22} className="text-blue-400" />
                  Primary Edge Nodes
                </h3>
                <span className="text-[10px] font-black bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full uppercase">Region: SouthEast Asia</span>
             </div>

             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                    <tr className="text-[10px] font-black uppercase text-slate-500 border-b border-white/5">
                       <th className="pb-4">Node Identifier</th>
                       <th className="pb-4">Operator Link</th>
                       <th className="pb-4">Status</th>
                       <th className="pb-4">Latency</th>
                       <th className="pb-4 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm">
                    {nodes.map((node, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0">
                         <td className="py-4 font-mono text-xs">{node.id}</td>
                         <td className="py-4 font-bold text-slate-300">{node.provider}</td>
                         <td className="py-4">
                            <span className={`flex items-center gap-1.5 text-[10px] font-black ${
                              node.status === 'ONLINE' ? 'text-green-500' : 
                              node.status === 'MAINTENANCE' ? 'text-amber-500' : 'text-red-500'
                            }`}>
                               <div className={`w-1.5 h-1.5 rounded-full ${
                                 node.status === 'ONLINE' ? 'bg-green-500 animate-pulse shadow-[0_0_8px_green]' : 
                                 node.status === 'MAINTENANCE' ? 'bg-amber-500' : 'bg-red-500'
                               }`}></div>
                               {node.status}
                            </span>
                         </td>
                         <td className="py-4 font-mono text-xs text-slate-500">{node.latency}</td>
                         <td className="py-4 text-right">
                            <button 
                              onClick={() => toggleNode(i)}
                              className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"
                            >
                               <Power size={14} />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
          </div>

          <div className="glass rounded-[2rem] p-8 border border-white/5 flex flex-col h-[350px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Terminal size={20} className="text-blue-400" />
                Live Kernel Streams
              </h3>
              <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                 <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-75"></div>
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-150"></div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs p-4 bg-black/40 rounded-2xl border border-white/5 custom-scrollbar">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-4 p-2 rounded hover:bg-white/5 transition-colors group">
                  <span className="text-slate-600 group-hover:text-slate-400">[{log.time}]</span>
                  <span className={
                    log.status === 'success' ? 'text-green-400' : 
                    log.status === 'warning' ? 'text-amber-400' : 'text-blue-400'
                  }>{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass rounded-[2rem] p-8 border border-white/5 space-y-6 bg-gradient-to-br from-red-600/10 to-transparent">
              <h3 className="text-lg font-bold flex items-center gap-2 text-red-500">
                <ShieldAlert size={20} />
                Security Overrides
              </h3>
              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-red-500/30">
                    <div>
                       <p className="text-xs font-bold">Maintenance Mode</p>
                       <p className="text-[10px] text-slate-500">Global Read-Only Lock</p>
                    </div>
                    <div className="w-10 h-6 bg-slate-800 rounded-full relative p-1 transition-colors group-hover:bg-slate-700">
                       <div className="w-4 h-4 bg-slate-500 rounded-full"></div>
                    </div>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-red-500/30">
                    <div>
                       <p className="text-xs font-bold">Force Cache Flush</p>
                       <p className="text-[10px] text-slate-500">Purge 4GB Edge Data</p>
                    </div>
                    <RefreshCw size={16} className="text-slate-500 group-hover:rotate-180 transition-transform duration-700" />
                 </div>
              </div>
              <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-start gap-3">
                 <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                 <p className="text-[10px] text-red-200 leading-relaxed font-medium">
                    Critical: Unrecognized session pattern detected from region CN-BJ. Edge Firewall has isolated the node.
                 </p>
              </div>
           </div>

           <div className="glass rounded-[2rem] p-8 border border-white/5 space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <HardDrive size={20} className="text-amber-500" />
                Data Integrity
              </h3>
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    <span>Block Propagation</span>
                    <span>100%</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full shadow-[0_0_8px_green]"></div>
                 </div>
              </div>
              <ul className="space-y-3">
                 {[
                   { label: 'Blockchain Height', value: '#24,092' },
                   { label: 'Consensus Mode', value: 'Proof of Nexus' },
                   { label: 'Sync Status', value: 'SYMMETRIC' },
                 ].map((item, i) => (
                   <li key={i} className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="font-bold text-slate-300">{item.value}</span>
                   </li>
                 ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};
