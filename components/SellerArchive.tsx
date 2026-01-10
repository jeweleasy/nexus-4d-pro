
import React, { useState, useMemo, useEffect } from 'react';
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
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { MOCK_SELLERS } from '../constants';
import { Seller } from '../types';
import { ShadowButton } from './ShadowButton';
import { supabase } from '../services/supabase';

interface SellerArchiveProps {
  isAdmin: boolean;
  onNavigateToContact: () => void;
}

export const SellerArchive: React.FC<SellerArchiveProps> = ({ isAdmin, onNavigateToContact }) => {
  const [sellers, setSellers] = useState<Seller[]>(MOCK_SELLERS);
  const [loading, setLoading] = useState(false);
  const [searchZip, setSearchZip] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Form State for new seller listing
  const [newSeller, setNewSeller] = useState<Omit<Seller, 'id' | 'coordinates'>>({
    name: '',
    address: '',
    country: 'Malaysia',
    zipCode: '',
    contactPerson: '',
    contactNumber: ''
  });

  const countries = ['All', 'Malaysia', 'Singapore', 'Cambodia', 'Philippines'];

  useEffect(() => {
    fetchCloudSellers();
  }, []);

  const fetchCloudSellers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('*');
      
      if (data) {
        const cloudMapped: Seller[] = data.map(d => ({
          id: d.id,
          name: d.name,
          address: d.address,
          country: d.country,
          zipCode: d.zip_code,
          contactPerson: d.contact_person,
          contactNumber: d.contact_number,
          coordinates: { lat: d.lat || 3.14, lng: d.lng || 101.69 }
        }));
        setSellers([...MOCK_SELLERS, ...cloudMapped]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSellers = useMemo(() => {
    return sellers.filter(s => {
      const matchCountry = selectedCountry === 'All' || s.country === selectedCountry;
      const matchZip = !searchZip || s.zipCode.includes(searchZip);
      return matchCountry && matchZip;
    });
  }, [sellers, selectedCountry, searchZip]);

  const handleAddSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Node Identity required for terminal deployment.");
        return;
      }

      const { data, error } = await supabase
        .from('sellers')
        .insert({
          user_id: user.id,
          name: newSeller.name,
          address: newSeller.address,
          country: newSeller.country,
          zip_code: newSeller.zipCode,
          contact_person: newSeller.contactPerson,
          contact_number: newSeller.contactNumber
        })
        .select()
        .single();

      if (data) {
        const seller: Seller = {
          id: data.id,
          name: data.name,
          address: data.address,
          country: data.country,
          zipCode: data.zip_code,
          contactPerson: data.contact_person,
          contactNumber: data.contact_number,
          coordinates: { lat: 3.14, lng: 101.69 }
        };
        setSellers([seller, ...sellers]);
        setShowAddForm(false);
        setNewSeller({ name: '', address: '', country: 'Malaysia', zipCode: '', contactPerson: '', contactNumber: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
            <Globe className="text-blue-500" size={28} />
            Terminal Matrix
          </h2>
          <p className="text-slate-500 text-sm mt-1 uppercase font-black tracking-widest">Deploy & Index Authorized Node Outlets</p>
        </div>
        
        <ShadowButton 
          onClick={() => setShowAddForm(!showAddForm)}
          variant="gold"
          className="flex items-center gap-2 px-8 py-3 text-xs font-black uppercase tracking-widest"
        >
          {showAddForm ? <X size={18} /> : <Plus size={18} />}
          {showAddForm ? 'Abort Deployment' : 'Deploy New Terminal'}
        </ShadowButton>
      </div>

      {showAddForm && (
        <div className="glass p-8 rounded-[2.5rem] border border-blue-500/20 bg-blue-600/5 space-y-6 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
              <Building size={20} />
            </div>
            <h3 className="text-lg font-orbitron font-bold text-white uppercase tracking-widest">New Property Node</h3>
          </div>

          <form onSubmit={handleAddSeller} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input required placeholder="Outlet Title" value={newSeller.name} onChange={e => setNewSeller({...newSeller, name: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none text-white" />
            <input required placeholder="Full Address" value={newSeller.address} onChange={e => setNewSeller({...newSeller, address: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none text-white" />
            <select value={newSeller.country} onChange={e => setNewSeller({...newSeller, country: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none text-slate-300">
             {countries.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input required placeholder="Zip Code" value={newSeller.zipCode} onChange={e => setNewSeller({...newSeller, zipCode: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none text-white" />
            <input required placeholder="Operator Identity" value={newSeller.contactPerson} onChange={e => setNewSeller({...newSeller, contactPerson: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none text-white" />
            <input required placeholder="Contact Channel" value={newSeller.contactNumber} onChange={e => setNewSeller({...newSeller, contactNumber: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none text-white" />
            <ShadowButton disabled={isSyncing} variant="primary" className="lg:col-span-3 py-4 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
              {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
              {isSyncing ? 'Transmitting Data...' : 'Synchronize Node to Hub'}
            </ShadowButton>
          </form>
        </div>
      )}

      {/* Grid Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {loading && (
           <div className="col-span-full py-20 flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-blue-500" size={40} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Querying Global Matrix...</p>
           </div>
        )}
        {!loading && filteredSellers.length > 0 ? filteredSellers.map((seller) => (
          <div key={seller.id} className="glass rounded-[2.5rem] border border-white/10 p-8 group hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden flex flex-col h-full shadow-xl">
             <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
             <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                   <Building size={28} />
                </div>
                <div>
                   <h3 className="text-xl font-orbitron font-bold text-white uppercase">{seller.name}</h3>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Region: {seller.country}</p>
                </div>
             </div>
             <div className="space-y-6 flex-1">
                <div className="flex items-start gap-3">
                   <MapPin className="text-slate-600 mt-1" size={18} />
                   <p className="text-sm font-medium text-slate-300 leading-relaxed">{seller.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                      <User className="text-blue-500/60" size={18} />
                      <p className="text-xs font-bold truncate">{seller.contactPerson}</p>
                   </div>
                   <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                      <Phone className="text-green-500/60" size={18} />
                      <p className="text-xs font-bold truncate">{seller.contactNumber}</p>
                   </div>
                </div>
             </div>
          </div>
        )) : !loading && (
          <div className="lg:col-span-2 py-32 text-center glass rounded-[3rem] border-2 border-dashed border-white/5 opacity-40">
             <AlertCircle size={64} className="mx-auto text-slate-800" />
             <h3 className="text-2xl font-orbitron font-bold text-slate-600 uppercase tracking-widest">No Active Signals</h3>
          </div>
        )}
      </div>
    </div>
  );
};
