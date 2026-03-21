import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Briefcase, Users, Search, ShieldAlert, Sparkles, Loader2, Info, Edit2, Trash2, ArrowRight, X } from 'lucide-react';

const JobRoles: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '', department: '', description: '', requiredSkills: '', experienceLevel: 'Mid', status: 'active'
  });
  const [isScanning, setIsScanning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [biasResult, setBiasResult] = useState<any>(null);

  const generateWithAI = async () => {
    if (!formData.title) return;
    setIsGenerating(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/roles/generate', {
        title: formData.title
      }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setFormData({
        ...formData,
        description: data.description,
        requiredSkills: Array.isArray(data.requiredSkills) ? data.requiredSkills.join(', ') : data.requiredSkills
      });
    } catch (error) {
      console.error('Generation error', error);
    }
    setIsGenerating(false);
  };

  const scanForBias = async () => {
    if (!formData.description) return;
    setIsScanning(true);
    setBiasResult(null);
    try {
      const { data } = await axios.post('http://localhost:5000/api/roles/scan-bias', {
        description: formData.description
      }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setBiasResult(data);
    } catch (error) {
      console.error('Bias scan error', error);
    }
    setIsScanning(false);
  };

  useEffect(() => {
    fetchRoles();
  }, [user]);

  const fetchRoles = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/roles', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setRoles(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoleId) {
        await axios.put(`http://localhost:5000/api/roles/${editingRoleId}`, formData, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/roles', formData, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
      }
      setShowModal(false);
      setEditingRoleId(null);
      fetchRoles();
      setFormData({ title: '', department: '', description: '', requiredSkills: '', experienceLevel: 'Mid', status: 'active' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/roles/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      fetchRoles();
    } catch (error) {
      console.error('Delete error', error);
    }
  };

  const handleCreateClick = () => {
    setFormData({ title: '', department: '', description: '', requiredSkills: '', experienceLevel: 'Mid', status: 'active' });
    setEditingRoleId(null);
    setBiasResult(null);
    setShowModal(true);
  };

  const filteredRoles = roles.filter(role => 
    role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-10 pb-12">
      {/* Background Orbs */}
      <div className="bg-glow glow-blue w-[500px] h-[500px] -top-40 -left-20" />
      <div className="bg-glow glow-purple w-[400px] h-[400px] bottom-0 -right-20" />

      <div className="container-premium relative z-10">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium tracking-wider uppercase">
              Talent Management
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium tracking-wider uppercase">
              Strategic Hiring
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-slate-900 dark:text-white">
                Job <span className="text-gradient">Portfolio</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg font-medium">
                Manage your strategic hiring mandates with AI-powered insights and real-time candidate matching.
              </p>
            </div>
            <button 
              onClick={handleCreateClick}
              className="btn-premium whitespace-nowrap"
            >
              <Plus size={20} />
              New Mandate
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="glass-card p-4 mb-10 rounded-2xl flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search roles or departments..."
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-widest">
            <Briefcase size={16} />
            <span>{filteredRoles.length} Active Mandates</span>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <div 
              key={role._id} 
              className="glass-card p-6 rounded-2xl hover-lift group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                    <Briefcase size={24} />
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setEditingRoleId(role._id);
                        setFormData({
                          title: role.title || '',
                          department: role.department || '',
                          description: role.description || '',
                          requiredSkills: Array.isArray(role.requiredSkills) ? role.requiredSkills.join(', ') : (role.requiredSkills || ''),
                          experienceLevel: role.experienceLevel || 'Mid',
                          status: role.status || 'active'
                        });
                        setShowModal(true);
                      }}
                      className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(role._id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-wide">
                  {role.title}
                </h3>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-6 font-bold uppercase tracking-widest">
                  <Users size={14} className="text-blue-500" />
                  <span>{role.department}</span>
                  <span className="mx-1 opacity-50">•</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black border transition-colors ${
                    role.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' : 'bg-slate-50 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-500/20'
                  }`}>
                    {role.status}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-8 leading-relaxed font-medium">
                  {role.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/5">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-blue-400 font-bold text-sm hover:gap-3 transition-all"
                  >
                    View Candidates <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={handleCreateClick}
            className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500/40 hover:text-blue-400 hover:bg-blue-500/5 transition-all group min-h-[300px]"
          >
            <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Plus size={32} />
            </div>
            <span className="font-bold">Add New Mandate</span>
          </button>
        </div>
      </div>

      {/* Modal Container */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
          
          <div className="relative glass-card w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
            <div className="p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {editingRoleId ? "Update" : "Create"} <span className="text-gradient">Mandate</span>
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mandate Title</label>
                       <button
                        type="button"
                        onClick={generateWithAI}
                        disabled={isGenerating || !formData.title}
                        className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 text-purple-400 hover:text-purple-300 disabled:opacity-30 transition-colors"
                      >
                        {isGenerating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                        AI Optimize
                      </button>
                    </div>
                    <input
                      type="text"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-bold placeholder:text-slate-400"
                      placeholder="e.g. Lead Cloud Architect"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-2">Department</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-bold placeholder:text-slate-400"
                      placeholder="e.g. Infrastructure"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                   <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Design Summary</label>
                    <button
                      type="button"
                      onClick={scanForBias}
                      disabled={isScanning || !formData.description}
                      className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 text-blue-400 hover:text-blue-300 disabled:opacity-30 transition-colors"
                    >
                      {isScanning ? <Loader2 size={10} className="animate-spin" /> : <ShieldAlert size={10} />}
                      Bias Check
                    </button>
                  </div>
                  <textarea
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all min-h-[100px] text-sm leading-relaxed placeholder:text-slate-400"
                    placeholder="Describe the mandate's impact..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  {biasResult && (
                    <div className="mt-3 p-4 rounded-xl border bg-blue-500/5 border-blue-500/20 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Info size={14} className="text-blue-600 dark:text-blue-400" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">Inclusion Analysis: {biasResult.score}/100</span>
                        </div>
                        <button onClick={() => setBiasResult(null)} className="text-[10px] text-slate-500 hover:text-slate-400 uppercase font-black">Close</button>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed italic">
                        {biasResult.issues?.length > 0 ? "Detected some phrasing that could be more inclusive. Consider AI suggestions." : "Perfect! This description uses highly inclusive language."}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Technical Core</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-sm font-bold placeholder:text-slate-400"
                      placeholder="React, AWS, Node.js"
                      value={formData.requiredSkills}
                      onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Experience Context</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-sm appearance-none font-bold"
                      value={formData.experienceLevel}
                      onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    >
                      <option>Intern</option>
                      <option>Entry</option>
                      <option>Junior</option>
                      <option>Mid</option>
                      <option>Senior</option>
                      <option>Lead</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-slate-200 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-glass"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-premium min-w-[160px]"
                  >
                    {editingRoleId ? "Update Mandate" : "Deploy Mandate"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default JobRoles;
