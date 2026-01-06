
import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Phone, 
  User, 
  Search, 
  Filter, 
  Plus, 
  ShieldCheck, 
  ArrowUpRight, 
  Globe, 
  Building,
  Navigation,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MOCK_SELLERS } from '../constants';
import { Seller } from '../types';
import { ShadowButton } from './ShadowButton';

interface SellerArchiveProps {
  isAdmin: boolean;
  onNavigateToContact: () => void;
}

export const SellerArchive: React.FC<SellerArchiveProps> = ({ isAdmin, onNavigateToContact }) => {
  const [sellers, setSellers] = useState<Seller[]>(MOCK_SELLERS);
  const [searchZip, setSearchZip] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State for new seller
  const [newSeller, setNewSeller] = useState<Omit<Seller, 'id' | 'coordinates'>>({
    name: '',
    address: '',
    country: 'Malaysia',
    zipCode: '',
    contactPerson: '',
    contactNumber: ''
  });

  const countries = ['All', 'Malaysia', 'Singapore', 'Cambodia', 'Philippines'];

  const filteredSellers = useMemo(() => {
    return sellers.filter(s => {
      const matchCountry = selectedCountry === 'All' || s.country === selectedCountry;
      const matchZip = !searchZip || s.zipCode.includes(searchZip);
      return matchCountry && matchZip;
    });
  }, [sellers, selectedCountry, searchZip]);

  const handleAddSeller = (e: React.FormEvent) => {
    e.preventDefault();
    const seller: Seller = {
      ...newSeller,
      id: `s-${Date.now()}`,
      coordinates: { lat: 3.1, lng: 101.7 } // Mock coords
    };
    setSellers([seller, ...sellers]);
    setShowAddForm(false);
    setNewSeller({ name: '', address: '', country: 'Malaysia', zipCode: '', contactPerson: '', contactNumber: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
            <Globe className="text-blue-500" size={28} />
            Seller Network
          </h2>
          <p className="text-slate-500 text-sm mt-1 uppercase font-black tracking-widest">Global Terminal Directory & Node Management</p>
        </div>
        
        <ShadowButton 
          onClick={onNavigateToContact}
          variant="gold"
          className="flex items-center gap-2 px-8 py-3 text-xs font-black uppercase tracking-widest"
        >
          <Plus size={18} /> Apply for Node Agency
        </ShadowButton>
      </div>

      {/* Admin Panel */}
      {isAdmin && (
        <div className="glass p-8 rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-lg font-orbitron font-bold">Admin Ops: Terminal Control</h3>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-[10px] font-black uppercase tracking-widest bg-amber-500 text-black px-4 py-2 rounded-xl hover:bg-amber-400 transition-all"
            >
              {showAddForm ? 'Close Dispatch' : 'Register New Node'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddSeller} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-top-4 duration-300">
              <input required placeholder="Terminal Name" value={newSeller.name} onChange={e => setNewSeller({...newSeller, name: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-amber-500/50 outline-none" />
              <input required placeholder="Full Address" value={newSeller.address} onChange={e => setNewSeller({...newSeller, address: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-amber-500/50 outline-none" />
              <select value={newSeller.country} onChange={e => setNewSeller({...newSeller, country: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-amber-500/50 outline-none">
                {countries.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input required placeholder="Zip Code" value={newSeller.zipCode} onChange={e => setNewSeller({...newSeller, zipCode: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-amber-500/50 outline-none" />
              <input required placeholder="Contract Person" value={newSeller.contactPerson} onChange={e => setNewSeller({...newSeller, contactPerson: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-amber-500/50 outline-none" />
              <input required placeholder="Contract Number" value={newSeller.contactNumber} onChange={e => setNewSeller({...newSeller, contactNumber: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-amber-500/50 outline-none" />
              <ShadowButton variant="primary" className="lg:col-span-3 py-3 font-black text-xs">COMMISSION NODE</ShadowButton>
            </form>
          )}
        </div>
      )}

      {/* Filter Console */}
      <div className="glass p-8 rounded-[2.5rem] border border-white/10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Country Domain</label>
            <div className="relative">
              <select 
                value={selectedCountry}
                onChange={e => setSelectedCountry(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-sm font-bold appearance-none outline-none focus:border-blue-500/50"
              >
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Location Signal (Zip / Street)</label>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Enter Zip Code to pulse area nodes..." 
                value={searchZip}
                onChange={e => setSearchZip(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-sm font-bold focus:border-blue-500/50 outline-none transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              {searchZip && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30 animate-pulse">
                   <span className="text-[8px] font-black text-blue-400 uppercase">Syncing area...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Seller Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSellers.length > 0 ? filteredSellers.map((seller, idx) => (
          <div key={seller.id} className="glass rounded-[2.5rem] border border-white/10 p-8 group hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden flex flex-col h-full shadow-xl">
             <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-all" />
             
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform">
                      <Building size={28} />
                   </div>
                   <div>
                      <h3 className="text-xl font-orbitron font-bold group-hover:text-blue-400 transition-colors">{seller.name}</h3>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Navigation size={10} /> Active Node &bull; {seller.country}
                      </p>
                   </div>
                </div>
                <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[8px] font-black uppercase border border-green-500/20 flex items-center gap-1">
                   <CheckCircle2 size={10} /> Certified
                </span>
             </div>

             <div className="space-y-6 flex-1">
                <div className="flex items-start gap-3">
                   <MapPin className="text-slate-600 mt-1 shrink-0" size={18} />
                   <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Terminal Address</p>
                      <p className="text-sm font-medium text-slate-300 leading-relaxed">{seller.address}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                      <User className="text-blue-500/60" size={18} />
                      <div className="overflow-hidden">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Contract Person</p>
                        <p className="text-xs font-bold truncate">{seller.contactPerson}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                      <Phone className="text-green-500/60" size={18} />
                      <div className="overflow-hidden">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Contract Number</p>
                        <p className="text-xs font-bold truncate">{seller.contactNumber}</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Node Status: Online</span>
                </div>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${seller.coordinates.lat},${seller.coordinates.lng}`, '_blank')}
                  className="flex items-center gap-2 text-[10px] font-black text-blue-500 hover:text-white uppercase tracking-widest transition-all group/btn"
                >
                  NAVIGATE TO TERMINAL <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
             </div>
          </div>
        )) : (
          <div className="lg:col-span-2 py-32 text-center glass rounded-[3rem] border-2 border-dashed border-white/5 space-y-6">
             <AlertCircle size={64} className="mx-auto text-slate-800" />
             <div className="space-y-2">
                <h3 className="text-2xl font-orbitron font-bold text-slate-600 uppercase tracking-widest">No Signals Found</h3>
                <p className="text-slate-700 text-sm max-w-xs mx-auto">Adjust your geographic filters to locate the nearest 4D Nexus Node.</p>
             </div>
             <ShadowButton variant="secondary" onClick={() => { setSearchZip(''); setSelectedCountry('All'); }} className="px-10">Clear Filter Engine</ShadowButton>
          </div>
        )}
      </div>
    </div>
  );
};
