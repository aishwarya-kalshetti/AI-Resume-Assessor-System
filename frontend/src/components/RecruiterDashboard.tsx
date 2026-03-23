import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, Filter, EyeOff, Eye, ChevronRight, Mail, MessageSquare, Send, X, Bot, Loader2, Upload, GitCompare, Calendar, CheckSquare, Square, FileText, ChevronDown, ChevronUp, Trash2, Award } from 'lucide-react';
import Scorecard from './Scorecard';
import ComparisonModal from './ComparisonModal';
import ScheduleModal from './ScheduleModal';
import SimulationModal from './SimulationModal';
import AssessmentReportModal from './AssessmentReportModal';

const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [blindScreening, setBlindScreening] = useState(false);
  const [draftingOutreach, setDraftingOutreach] = useState(false);
  const [outreachDraft, setOutreachDraft] = useState<string | null>(null);
  const [outreachEmail, setOutreachEmail] = useState<string | null>(null);

  // Copilot State
  const [showCopilot, setShowCopilot] = useState(false);
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotChat, setCopilotChat] = useState<{ role: 'user' | 'bot', content: string }[]>([]);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);

  // Comparison State
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Batch Upload State
  const batchInputRef = useRef<HTMLInputElement>(null);
  const [batchStatus, setBatchStatus] = useState<string | null>(null);
  const [isBatchUploading, setIsBatchUploading] = useState(false);

  // Interview Scheduling State
  const [scheduledInterviews, setScheduledInterviews] = useState<{ [key: string]: any }>({});

  // Resume viewer state
  const [showFullResume, setShowFullResume] = useState(false);

  // Delete state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cross-role comparison: store all loaded matches globally
  const [allLoadedMatches, setAllLoadedMatches] = useState<any[]>([]);

  // Schedule modal state
  const [scheduleModalMatch, setScheduleModalMatch] = useState<any>(null);

  // Simulation modal state
  const [simulationMatch, setSimulationMatch] = useState<any>(null);

  // Assessment Report modal state
  const [assessmentReportMatch, setAssessmentReportMatch] = useState<any>(null);

  const [copySuccess, setCopySuccess] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      fetchMatchesForRole(selectedRole._id);
      setSelectedMatch(null);
      setOutreachDraft(null);
      setOutreachEmail(null);
    }
  }, [selectedRole]);

  const fetchRoles = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/roles', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setRoles(data);
      if (data.length > 0) setSelectedRole(data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMatchesForRole = async (roleId: string) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/matches/role/${roleId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setMatches(data);
      setAllLoadedMatches(prev => {
        const existingIds = new Set(prev.map((m: any) => m._id));
        const newItems = data.filter((m: any) => !existingIds.has(m._id));
        return [...prev, ...newItems];
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = async (matchId: string, newStatus: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/matches/${matchId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setMatches(matches.map(m => m._id === matchId ? { ...m, status: newStatus } : m));
      if (selectedMatch?._id === matchId) {
        setSelectedMatch({ ...selectedMatch, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const handleDraftOutreach = async () => {
    if (!selectedMatch) return;
    setDraftingOutreach(true);
    try {
      const { data } = await axios.post(`http://localhost:5000/api/matches/${selectedMatch._id}/outreach`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setOutreachDraft(data.draft);
      setOutreachEmail(data.candidateEmail);
    } catch (error) {
      console.error(error);
    }
    setDraftingOutreach(false);
  };

  const handleSendEmail = async () => {
    if (!selectedMatch || !outreachEmail || !outreachDraft) return;
    setEmailStatus('sending');
    try {
      await axios.post(`http://localhost:5000/api/matches/${selectedMatch._id}/send-outreach`, {
        email: outreachEmail,
        message: outreachDraft
      }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setEmailStatus('sent');
      setTimeout(() => setEmailStatus(null), 3000);
    } catch (error: any) {
      console.error('Send Error:', error);
      setEmailStatus(null);
    }
  };
  
  const handleInviteAssessment = async () => {
    if (!selectedMatch) return;
    setInviteStatus('sending');
    try {
      await axios.post(`http://localhost:5000/api/matches/${selectedMatch._id}/invite-assessment`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setInviteStatus('sent');
      setTimeout(() => setInviteStatus(null), 3000);
    } catch (error: any) {
      console.error('Invite Error:', error);
      alert(error.response?.data?.message || 'Failed to send assessment invite');
      setInviteStatus(null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const toggleCompare = (matchId: string) => {
    setCompareIds(prev =>
      prev.includes(matchId) ? prev.filter(id => id !== matchId) : prev.length < 2 ? [...prev, matchId] : prev
    );
  };

  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsBatchUploading(true);
    setBatchStatus(`Processing ${files.length} resume(s)...`);
    try {
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append('resumes', f));
      const { data } = await axios.post('http://localhost:5000/api/resumes/batch-upload', formData, {
        headers: { Authorization: `Bearer ${user?.token}`, 'Content-Type': 'multipart/form-data' }
      });
      setBatchStatus(data.message);
    } catch {
      setBatchStatus('Batch upload failed. Please try again.');
    } finally {
      setIsBatchUploading(false);
      if (batchInputRef.current) batchInputRef.current.value = '';
      setTimeout(() => setBatchStatus(null), 5000);
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/matches/${matchId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setMatches(prev => prev.filter(m => m._id !== matchId));
      setAllLoadedMatches(prev => prev.filter(m => m._id !== matchId));
      setCompareIds(prev => prev.filter(id => id !== matchId));
      if (selectedMatch?._id === matchId) setSelectedMatch(null);
    } catch {
      alert('Failed to delete candidate.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleCopilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim() || !selectedRole) return;
    const userMsg = copilotQuery;
    setCopilotChat(prev => [...prev, { role: 'user', content: userMsg }]);
    setCopilotQuery('');
    setIsCopilotLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/copilot/query', {
        message: userMsg,
        roleId: selectedRole._id,
        history: copilotChat
      }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setCopilotChat(prev => [...prev, { role: 'bot', content: data.answer }]);
    } catch {
      setCopilotChat(prev => [...prev, { role: 'bot', content: "Sorry, I'm having trouble connecting." }]);
    }
    setIsCopilotLoading(false);
  };

  const handleScheduled = (result: any) => {
    // result is the updated match object returned from backend
    setMatches(matches.map(m => m._id === result._id ? result : m));
    if (selectedMatch && selectedMatch._id === result._id) {
      setSelectedMatch(result);
    }
    setScheduleModalMatch(null);
  };

  const compareMatches = allLoadedMatches.filter(m => compareIds.includes(m._id));

  return (
    <div className="min-h-screen bg-transparent pt-10 pb-20 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="bg-glow glow-blue w-[600px] h-[600px] -top-60 -left-60" />
      <div className="bg-glow glow-purple w-[400px] h-[400px] -bottom-20 -right-20" />

      <div className="container-premium relative z-10">
        {/* Workspace Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-widest uppercase">
                Enterprise Suite
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                <Bot size={12} /> AI Copilot Active
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              Recruiter <span className="text-gradient">Workspace</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl text-lg leading-relaxed font-medium">
              Orchestrate your talent pipeline with neural matching and real-time behavioral insights.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <input ref={batchInputRef} type="file" multiple accept=".pdf" className="hidden" id="batch-upload-input" onChange={handleBatchUpload} />
            <label
              htmlFor="batch-upload-input"
              className={`btn-glass px-6 py-3 cursor-pointer flex items-center gap-2 hover:bg-blue-600/10 hover:border-blue-500/40 transition-all font-bold text-sm shadow-lg ${isBatchUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {isBatchUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} className="text-blue-500" />}
              Batch Upload
            </label>

            {compareIds.length === 2 && (
              <button onClick={() => setShowComparison(true)} className="btn-premium bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 px-6 py-3">
                <GitCompare size={18} /> Compare Pair
              </button>
            )}

            <button
              onClick={() => setBlindScreening(!blindScreening)}
              className={`btn-glass px-6 py-3 flex items-center gap-2 font-bold text-sm shadow-lg border-white/10 ${blindScreening ? 'bg-purple-500/10 border-purple-500/40 text-purple-600 dark:text-purple-400' : 'hover:bg-slate-200 dark:hover:bg-white/10'}`}
            >
              {blindScreening ? <><EyeOff size={18} className="text-purple-500" /> Blind Mode</> : <><Eye size={18} className="text-slate-600 dark:text-slate-400" /> Standard View</>}
            </button>
          </div>
        </div>

        {batchStatus && (
          <div className="fixed bottom-24 right-6 z-40 glass-card px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 flex items-center gap-4 border-white/10 max-w-sm">
            {isBatchUploading ? <Loader2 size={18} className="animate-spin text-blue-500" /> : <Upload size={18} className="text-emerald-500" />}
            <p className="text-sm text-slate-200 font-bold">{batchStatus}</p>
          </div>
        )}

        {/* Comparison Modal Placeholder */}
        {showComparison && compareMatches.length === 2 && (
          <ComparisonModal candidates={compareMatches} onClose={() => setShowComparison(false)} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
          {/* Sidebar */}
          <div className="lg:col-span-1 border-r border-white/5 pr-0 lg:pr-8 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Mandates</h3>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-400">{roles.length}</span>
            </div>

            <div className="space-y-4">
              {roles.map(role => (
                <div
                  key={role._id}
                  onClick={() => setSelectedRole(role)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border group relative overflow-hidden ${selectedRole?._id === role._id
                      ? 'glass-card border-blue-500/40 shadow-blue-500/10 dark:border-blue-500/30'
                      : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm dark:shadow-none'
                    }`}
                >
                  <div className="relative z-10">
                    <h4 className={`font-bold transition-colors ${selectedRole?._id === role._id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                      {role.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Users size={12} className={selectedRole?._id === role._id ? 'text-blue-600 dark:text-blue-500' : ''} />
                        {role.experienceLevel}
                      </span>
                      <span>•</span>
                      <span className="text-blue-600/80 dark:text-blue-500/80 tracking-widest">
                        {selectedRole?._id === role._id ? matches.length + ' Matched' : 'Neural Pipeline'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Pipeline Area */}
          <div className="lg:col-span-3 space-y-10">
            <div className="flex justify-between items-center px-2">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedRole ? (
                    <><span className="text-gradient uppercase tracking-wide">{selectedRole.title}</span> Pipeline</>
                  ) : <span className="text-slate-500 italic">Select a Mandate to Orchestrate</span>}
                </h3>
              </div>
              {selectedRole && (
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full tracking-[0.2em] shadow-inner">
                  <Filter size={14} className="text-blue-500" />
                  NEURAL RANKING ACTIVE
                </div>
              )}
            </div>

            {!selectedMatch ? (
              <div className="space-y-4 animate-in fade-in duration-500">
                {matches.map((match, idx) => (
                  <div
                    key={match._id}
                    onClick={(e) => { if ((e.target as HTMLElement).closest('.no-click')) return; setSelectedMatch(match); }}
                    className="glass-card p-6 rounded-3xl hover-lift cursor-pointer flex items-center justify-between group border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="no-click flex-shrink-0" onClick={e => e.stopPropagation()}>
                        <button onClick={() => toggleCompare(match._id)} className="text-slate-500 hover:text-blue-400 transition-colors py-2">
                          {compareIds.includes(match._id) ? <CheckSquare size={22} className="text-blue-500" /> : <Square size={22} />}
                        </button>
                      </div>

                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-bold text-xl text-white shadow-2xl group-hover:border-blue-500/30 transition-all">
                          {blindScreening ? `C${idx + 1}` : (match.candidateName || match.resumeId?.parsedData?.name || match.candidateId?.name)?.charAt(0) || 'U'}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-[#0a0c10] flex items-center justify-center text-[10px] font-black shadow-lg ${match.overallScore > 80 ? 'bg-emerald-500 text-white' : match.overallScore > 65 ? 'bg-amber-500 text-white' : 'bg-slate-600 text-white'
                          }`}>
                          {match.overallScore}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight mb-1">
                          {blindScreening
                            ? `Strategic Talent #${(match.candidateId?._id || match._id).toString().substring(18)}`
                            : (match.candidateName || match.resumeId?.parsedData?.name || match.candidateId?.name || 'Unknown Talent')
                          }
                        </h4>
                        <div className="flex items-center gap-3">
                          {match.status === 'shortlisted' && (
                            <span className="text-[9px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black uppercase tracking-widest">Shortlisted</span>
                          )}
                          {match.status === 'rejected' && (
                            <span className="text-[9px] px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase tracking-widest">Rejected</span>
                          )}
                          <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                            {match.resumeId?.parsedData?.experienceYears || 0}Y Neural Tenure
                          </span>
                          {match.interviewDate && (
                            <span className="text-[9px] px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 font-black uppercase tracking-widest">
                              {new Date(match.interviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {match.interviewTime}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden md:flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5">Neural Match</span>
                        <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                          <div
                            className={`h-full transition-all duration-1000 ${match.overallScore > 80 ? 'bg-blue-500' : match.overallScore > 65 ? 'bg-indigo-500' : 'bg-slate-600'
                              }`}
                            style={{ width: `${match.overallScore}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          className="no-click p-2.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all"
                          onClick={(e) => { e.stopPropagation(); setScheduleModalMatch(match); }}
                          title="Schedule Interview"
                        >
                          <Calendar size={20} />
                        </button>
                        <button
                          className="no-click p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(match._id); }}
                          title="Delete Candidate"
                        >
                          <Trash2 size={18} />
                        </button>
                        <ChevronRight className="text-slate-700 group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                ))}
                {matches.length === 0 && selectedRole && (
                  <div className="p-20 text-center glass-card rounded-[2.5rem] border-white/5 border-dashed border-2 m-4">
                    <div className="bg-white/5 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Users size={32} className="text-slate-600" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Neural pipeline empty for this mandate.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-10 animate-in slide-in-from-right-10 fade-in duration-500">
                <button
                  onClick={() => { setSelectedMatch(null); setOutreachDraft(null); setOutreachEmail(null); }}
                  className="btn-glass w-max shadow-xl hover:scale-105 active:scale-95 px-6 font-bold uppercase tracking-widest text-xs py-3"
                >
                  ← Return to Pipeline
                </button>

                <div className="glass-card p-10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative overflow-hidden border-white/10 shadow-2xl">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full -mr-40 -mt-40 blur-[100px]" />

                  <div className="flex items-center gap-8 relative z-10">
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-4xl text-white shadow-2xl shadow-blue-500/40 border border-white/20">
                      {blindScreening ? `T` : (selectedMatch.candidateName || selectedMatch.resumeId?.parsedData?.name || selectedMatch.candidateId?.name)?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                        {blindScreening
                          ? `Mandate Target #${(selectedMatch.candidateId?._id || selectedMatch._id).toString().substring(18)}`
                          : (selectedMatch.candidateName || selectedMatch.resumeId?.parsedData?.name || selectedMatch.candidateId?.name || 'Unknown Talent')
                        }
                      </h3>
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] text-slate-600 dark:text-slate-400 font-black uppercase tracking-widest">
                          {selectedMatch.resumeId?.parsedData?.experienceYears || 0} Neural Years
                        </span>
                        <span className="px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest">
                          {selectedMatch.resumeId?.parsedData?.skills?.length || 0} Technical Tokens
                        </span>
                        {selectedMatch.interviewDate && (
                          <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-500 font-black uppercase tracking-widest shadow-inner">
                            {new Date(selectedMatch.interviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {selectedMatch.interviewTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 w-full md:w-auto relative z-10">
                    <button
                      onClick={handleDraftOutreach}
                      disabled={draftingOutreach || !!outreachDraft}
                      className="btn-glass flex-1 md:flex-none border-purple-500/30 text-purple-400 bg-purple-500/5 hover:bg-purple-500/10 py-3.5"
                    >
                      <Mail size={18} /> {draftingOutreach ? 'Optimizing...' : 'AI Outreach'}
                    </button>
                    <button
                      onClick={handleInviteAssessment}
                      disabled={inviteStatus !== null}
                      className={`btn-glass flex-1 md:flex-none border-indigo-500/30 text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 py-3.5 ${inviteStatus === 'sent' ? 'bg-indigo-500/20' : ''}`}
                    >
                      <Send size={18} /> {inviteStatus === 'sending' ? 'Sending Invite...' : inviteStatus === 'sent' ? 'Invite Sent' : 'Invite Assessment'}
                    </button>
                    <button
                      onClick={() => setSimulationMatch(selectedMatch)}
                      className="btn-glass flex-1 md:flex-none border-blue-500/30 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 py-3.5"
                    >
                      <Bot size={18} /> Sim Mode
                    </button>
                    <button
                      onClick={() => setAssessmentReportMatch(selectedMatch)}
                      className="btn-glass flex-1 md:flex-none border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 py-3.5"
                    >
                      <Award size={18} /> AI Report
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedMatch._id, 'shortlisted')}
                      className={`btn-premium flex-1 md:flex-none min-w-[160px] py-3.5 ${selectedMatch.status === 'shortlisted' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/40' : ''
                        }`}
                    >
                      {selectedMatch.status === 'shortlisted' ? 'Decision Final' : 'Deploy Shortlist'}
                    </button>
                  </div>
                </div>

                {outreachDraft && (
                  <div className="glass-card p-10 rounded-3xl border-purple-500/30 shadow-2xl animate-in zoom-in-95 duration-500">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400 mb-6">Hyper-Personalized Outreach Draft</p>
                    <div className="mb-6 flex items-center gap-4 bg-slate-50 dark:bg-black/40 p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                      <span className="text-xs font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest">Signal To:</span>
                      <input
                        type="email"
                        value={outreachEmail || ''}
                        onChange={(e) => setOutreachEmail(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm font-bold text-blue-400 w-full"
                      />
                    </div>
                    <textarea
                      value={outreachDraft || ''}
                      onChange={(e) => setOutreachDraft(e.target.value)}
                      className="w-full h-80 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl p-6 text-slate-800 dark:text-slate-300 text-sm outline-none focus:border-purple-500/40 resize-none mb-6 transition-all scrollbar-premium leading-relaxed font-medium"
                    />
                    <div className="flex justify-end gap-4">
                      <button onClick={() => handleCopy(outreachDraft)} className="btn-glass py-2.5 px-6 font-bold text-slate-700 dark:text-slate-300">
                        {copySuccess ? 'Copied!' : 'Copy Protocol'}
                      </button>
                      <button
                        onClick={handleSendEmail}
                        disabled={emailStatus !== null}
                        className={`btn-premium bg-purple-600 hover:bg-purple-700 px-8 font-bold ${emailStatus === 'sent' ? 'bg-emerald-600' : ''}`}
                      >
                        {emailStatus === 'sending' ? 'Transmitting...' : emailStatus === 'sent' ? 'Signal Deployed' : 'Send Email to Candidate'}
                      </button>
                    </div>
                  </div>
                )}

                {selectedMatch.resumeId && (
                  <div className="glass-card rounded-[2.5rem] overflow-hidden border-slate-200 dark:border-white/5 shadow-2xl">
                    <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-rose-600/20 rounded-2xl flex items-center justify-center border border-orange-500/30 shadow-lg shadow-orange-500/10">
                          <FileText size={24} className="text-orange-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">Neural Extraction Report</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-[0.2em]">{selectedMatch.resumeId?.fileName || 'Verified Document'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => window.open(`http://localhost:5000${selectedMatch.resumeId.fileUrl}`, '_blank')}
                          className="btn-glass py-2 px-5 text-xs font-bold"
                        >
                          <Eye size={16} /> PDF SOURCE
                        </button>
                        <span className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest shadow-inner">Verified Integrity</span>
                      </div>
                    </div>

                    <div className="p-10 space-y-12">
                      {selectedMatch.resumeId?.parsedData?.summary && (
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-500">Strategic Summary</p>
                          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-white/[0.03] p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-inner italic">
                            "{selectedMatch.resumeId.parsedData.summary}"
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-6">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Technical Arsenal</p>
                          <div className="flex flex-wrap gap-2.5">
                            {(selectedMatch.resumeId?.parsedData?.skills || []).map((skill: string) => (
                              <span key={skill} className="text-[11px] font-black bg-blue-500/5 text-blue-400 border border-blue-500/10 px-4 py-2 rounded-xl hover:bg-blue-500/10 transition-all cursor-default">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-8">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-500 mb-4">Experience Depth</p>
                            <div className="flex items-baseline gap-3">
                              <span className="text-5xl font-black text-slate-900 dark:text-white leading-none">{selectedMatch.resumeId?.parsedData?.experienceYears ?? '?'}</span>
                              <span className="text-sm font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">Neural Years in Field</span>
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-500 mb-4">Academic Foundation</p>
                            <div className="flex flex-wrap gap-2.5">
                              {(selectedMatch.resumeId?.parsedData?.education || ['Verification Required']).map((edu: string) => (
                                <span key={edu} className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner">
                                  {edu}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {selectedMatch.resumeId?.parsedData?.rawText && (
                        <div className="pt-10 border-t border-white/5">
                          <button
                            onClick={() => setShowFullResume(v => !v)}
                            className="w-full flex items-center justify-between px-8 py-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"
                          >
                            <span className="flex items-center gap-4 text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                              <FileText size={20} className="text-blue-500" />
                              {showFullResume ? 'Decompress Neural Source' : 'Inspect Raw Data Signal'}
                            </span>
                            <ChevronDown size={20} className={`text-slate-600 transition-transform duration-500 ${showFullResume ? 'rotate-180' : ''}`} />
                          </button>

                          {showFullResume && (
                            <div className="mt-6 animate-in fade-in slide-in-from-top-6 duration-700">
                              <div className="bg-black/60 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                                <pre className="p-8 text-[11px] text-slate-500 whitespace-pre-wrap font-mono leading-loose max-h-[600px] overflow-y-auto scrollbar-premium">
                                  {selectedMatch.resumeId.parsedData.rawText}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Scorecard match={selectedMatch} />
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-10 right-10 z-50">
          {!showCopilot ? (
            <button
              onClick={() => setShowCopilot(true)}
              className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-all group border border-white/20 hover:border-blue-400/50"
            >
              <MessageSquare size={32} className="group-hover:rotate-12 transition-all duration-500 shrink-0" />
              <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#0a0c10] animate-pulse shadow-lg"></div>
            </button>
          ) : (
            <div className="w-[350px] md:w-[450px] h-[650px] glass-card rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-20 fade-in duration-700 border-white/10">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 flex justify-between items-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="flex items-center gap-5 relative z-10">
                  <div className="bg-white/20 p-2.5 rounded-[1.2rem] backdrop-blur-xl shadow-inner border border-white/20">
                    <Bot size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-lg tracking-tight leading-none">Neural Copilot</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                      <span className="text-[10px] text-blue-100 font-bold uppercase tracking-[0.2em] opacity-80">Network Latency: 8ms</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowCopilot(false)}
                  className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-2xl transition-all relative z-10"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-premium bg-white/[0.01]">
                {copilotChat.length === 0 && (
                  <div className="text-center py-16 px-6">
                    <div className="bg-blue-600/10 w-24 h-24 rounded-[3rem] flex items-center justify-center mx-auto mb-8 border border-blue-500/20 shadow-inner relative group">
                      <div className="absolute inset-0 bg-blue-500/10 rounded-[3rem] blur-xl group-hover:blur-2xl transition-all" />
                      <Bot size={44} className="text-blue-500 relative z-10" />
                    </div>
                    <h5 className="text-white font-black mb-3 text-2xl tracking-tight uppercase">Oracle Protocol Active</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-500 leading-relaxed mb-10 font-medium">
                      Mandate database <span className="text-blue-600 dark:text-blue-400 font-black">{selectedRole?.title || 'GENERAL'}</span> successfully indexed. How shall I assist your orchestration?
                    </p>
                    <div className="grid grid-cols-1 gap-3.5 mt-6">
                      {[
                        "Synthesize top technical fit",
                        "Surface Python proficiency",
                        "Analyze leadership signals"
                      ].map(prompt => (
                        <button
                          key={prompt}
                          onClick={() => { setCopilotQuery(prompt); }}
                          className="text-[9px] text-center bg-slate-50 dark:bg-white/5 hover:bg-blue-600/10 p-4 rounded-[1.2rem] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all font-black uppercase tracking-[0.2em] shadow-sm"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {copilotChat.map((chat, i) => (
                  <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
                    <div className={`max-w-[85%] p-5 rounded-[1.8rem] text-sm font-semibold tracking-wide leading-relaxed ${chat.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none shadow-2xl shadow-blue-500/20'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-tl-none backdrop-blur-2xl shadow-xl'
                      }`}>
                      {chat.content}
                    </div>
                  </div>
                ))}
                {isCopilotLoading && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-white/5 p-5 rounded-[1.8rem] rounded-tl-none border border-white/10">
                      <Loader2 size={20} className="text-blue-400 animate-spin shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleCopilotSubmit} className="p-8 bg-white/[0.03] border-t border-white/5 flex gap-4 items-center">
                <input
                  type="text"
                  value={copilotQuery}
                  onChange={(e) => setCopilotQuery(e.target.value)}
                  placeholder="Signal to Copilot..."
                  className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[1.5rem] px-6 py-4 text-sm outline-none focus:border-blue-500/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition-all font-bold shadow-inner"
                />
                <button
                  type="submit"
                  disabled={isCopilotLoading || !copilotQuery.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl disabled:opacity-20 transition-all shadow-2xl shadow-blue-500/40 active:scale-90 flex items-center justify-center shrink-0 border border-white/10"
                >
                  <Send size={24} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* AI Modals Orchestration Layer */}
      <AIModals
        scheduleModalMatch={scheduleModalMatch}
        setScheduleModalMatch={setScheduleModalMatch}
        simulationMatch={simulationMatch}
        setSimulationMatch={setSimulationMatch}
        assessmentReportMatch={assessmentReportMatch}
        setAssessmentReportMatch={setAssessmentReportMatch}
        user={user}
        handleScheduled={handleScheduled}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative glass-card max-w-md w-full p-8 rounded-3xl border-red-500/20 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20 mx-auto">
              <Trash2 size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2 uppercase tracking-wide">Purge Candidate Signal?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8 font-medium">
              This action will permanently delete this candidate from the neural mandate. This cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-glass flex-1 font-bold text-sm"
              >
                Abort
              </button>
              <button
                onClick={() => handleDeleteMatch(deleteConfirmId)}
                disabled={isDeleting}
                className="btn-premium flex-1 bg-red-600 hover:bg-red-700 shadow-red-500/20 font-bold text-sm"
              >
                {isDeleting ? 'Purging...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Orchestration Sub-components Layer
interface AIModalsProps {
  scheduleModalMatch: any;
  setScheduleModalMatch: (v: any) => void;
  simulationMatch: any;
  setSimulationMatch: (v: any) => void;
  assessmentReportMatch: any;
  setAssessmentReportMatch: (v: any) => void;
  user: any;
  handleScheduled: (result: any) => void;
}

const AIModals: React.FC<AIModalsProps> = ({
  scheduleModalMatch,
  setScheduleModalMatch,
  simulationMatch,
  setSimulationMatch,
  assessmentReportMatch,
  setAssessmentReportMatch,
  user,
  handleScheduled
}) => (
  <>
    {scheduleModalMatch && (
      <ScheduleModal
        candidateName={scheduleModalMatch.candidateName || scheduleModalMatch.resumeId?.parsedData?.name || scheduleModalMatch.candidateId?.name || 'Unknown'}
        matchId={scheduleModalMatch._id}
        onClose={() => setScheduleModalMatch(null)}
        onScheduled={handleScheduled}
        token={user?.token || ''}
      />
    )}

    {simulationMatch && (
      <SimulationModal
        match={simulationMatch}
        onClose={() => setSimulationMatch(null)}
        token={user?.token || ''}
      />
    )}

    {assessmentReportMatch && (
      <AssessmentReportModal
        matchId={assessmentReportMatch._id}
        candidateName={assessmentReportMatch.candidateName || assessmentReportMatch.resumeId?.parsedData?.name || assessmentReportMatch.candidateId?.name || 'Candidate'}
        interviewDate={assessmentReportMatch.interviewDate}
        interviewTime={assessmentReportMatch.interviewTime}
        onClose={() => setAssessmentReportMatch(null)}
        token={user?.token || ''}
      />
    )}
  </>
);

export default RecruiterDashboard;
