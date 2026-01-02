
import React, { useState } from 'react';
import { Activity, Database, RefreshCw, Users, ShieldAlert, Cpu, HardDrive, Terminal } from 'lucide-react';
import { ShadowButton } from './ShadowButton';

export const AdminDashboard: React.FC = () => {
  const [syncing, setSyncing] = useState(false);
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

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
            <ShieldAlert className="text-red-500" />
            Admin Command Center
          </h2>
          <p className="text-slate-400 text-sm mt-1">System Health & Data Source Orchestration</p>
        </div>
        <ShadowButton onClick={handleGlobalSync} variant="primary" className="flex items-center gap-2">
          <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Syncing Sources...' : 'Force Global Sync'}
        </ShadowButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'System Uptime', value: '99.98%', icon: Activity, color: 'text-green-400' },
          { label: 'Active Sessions', value: '1,248', icon: Users, color: 'text-blue-400' },
          { label: 'ML Process Load', value: '12%', icon: Cpu, color: 'text-purple-400' },
          { label: 'Storage Used', value: '852GB', icon: HardDrive, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl flex items-center justify-between border-l-4 border-l-transparent hover:border-l-blue-500 transition-all">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{stat.label}</p>
              <p className="text-2xl font-orbitron font-bold mt-1">{stat.value}</p>
            </div>
            <stat.icon size={24} className={stat.color} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-2xl p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Terminal size={20} className="text-blue-400" />
              Live System Logs
            </h3>
            <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5">Streaming Active</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4 p-2 rounded hover:bg-white/5 transition-colors">
                <span className="text-slate-500">[{log.time}]</span>
                <span className={
                  log.status === 'success' ? 'text-green-400' : 
                  log.status === 'warning' ? 'text-amber-400' : 'text-blue-400'
                }>{log.msg}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Database size={20} className="text-amber-500" />
            Primary Aggregators
          </h3>
          <div className="space-y-4">
            {['Magnum 4D', 'Sports Toto', 'Da Ma Cai', 'Singapore Pools'].map((source, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-sm font-medium">{source}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-green-400 font-bold">STABLE</span>
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-xs text-red-400">
            <strong>Security Alert:</strong> 3 failed login attempts detected from IP 192.168.1.42. System isolation protocols ready.
          </div>
        </div>
      </div>
    </div>
  );
};
