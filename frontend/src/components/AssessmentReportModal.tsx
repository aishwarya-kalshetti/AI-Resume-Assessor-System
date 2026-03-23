import React, { useState, useEffect } from 'react';
import { X, CheckCircle, MessageSquare, Award, Loader2, AlertCircle, Play, Mic } from 'lucide-react';
import axios from 'axios';

interface AssessmentReportModalProps {
  matchId: string;
  candidateName: string;
  interviewDate?: string;
  interviewTime?: string;
  onClose: () => void;
  token: string;
}

const AssessmentReportModal: React.FC<AssessmentReportModalProps> = ({ matchId, candidateName, interviewDate, interviewTime, onClose, token }) => {
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssessment();
  }, [matchId]);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/assessments/match/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssessment(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Assessment data not found for this candidate.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[70]">
        <div className="bg-[#0d1117] p-12 rounded-3xl border border-gray-800 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-gray-400 font-medium">Retrieving Neural Assessment Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-[70] animate-in fade-in duration-300">
      <div className="bg-[#0d1117] w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-gray-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg">
              <Award size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">AI Pre-Screening Report</h3>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                  Candidate: <span className="text-blue-400">{candidateName}</span>
                </p>
                {interviewDate && (
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] text-blue-400 font-black uppercase tracking-widest shadow-inner shadow-blue-500/10">
                    Interview: {new Date(interviewDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} • {interviewTime}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-premium">
          {error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border border-amber-500/20">
                <AlertCircle size={40} className="text-amber-500" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Assessment Pending</h4>
              <p className="text-gray-500 max-w-sm mx-auto font-medium">
                The candidate hasn't completed their AI assessment yet. You'll be notified once the report is generated.
              </p>
            </div>
          ) : (
            <>
              {/* Score breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#161b22] border border-gray-800 p-6 rounded-3xl text-center space-y-2 group hover:border-blue-500/30 transition-all">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Overall Score</p>
                  <p className="text-4xl font-black text-white">{Math.round(assessment.overallAssessmentScore)}%</p>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-blue-500" style={{ width: `${assessment.overallAssessmentScore}%` }} />
                  </div>
                </div>
                <div className="bg-[#161b22] border border-gray-800 p-6 rounded-3xl text-center space-y-2 group hover:border-purple-500/30 transition-all">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Communication</p>
                  <p className="text-4xl font-black text-purple-400">{Math.round(assessment.communicationScore)}%</p>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-purple-500" style={{ width: `${assessment.communicationScore}%` }} />
                  </div>
                </div>
                <div className="bg-[#161b22] border border-gray-800 p-6 rounded-3xl text-center space-y-2 group hover:border-emerald-500/30 transition-all">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Tech Insights</p>
                  <p className="text-4xl font-black text-emerald-400">{Math.round(assessment.technicalScore)}%</p>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-emerald-500" style={{ width: `${assessment.technicalScore}%` }} />
                  </div>
                </div>
                
                {/* Secondary row of metrics */}
                <div className="bg-[#161b22] border border-gray-800 p-6 rounded-3xl text-center space-y-2 group hover:border-amber-500/30 transition-all">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Technical Depth</p>
                  <p className="text-4xl font-black text-amber-400">{Math.round(assessment.technicalDepth || 0)}%</p>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-amber-500" style={{ width: `${assessment.technicalDepth || 0}%` }} />
                  </div>
                </div>
                <div className="bg-[#161b22] border border-gray-800 p-6 rounded-3xl text-center space-y-2 group hover:border-red-500/30 transition-all">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Problem Solving</p>
                  <p className="text-4xl font-black text-red-400">{Math.round(assessment.problemSolving || 0)}%</p>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-red-500" style={{ width: `${assessment.problemSolving || 0}%` }} />
                  </div>
                </div>
                <div className="bg-[#161b22] border border-gray-800 p-6 rounded-3xl text-center space-y-2 group hover:border-pink-500/30 transition-all">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Professionalism</p>
                  <p className="text-4xl font-black text-pink-400">{Math.round(assessment.professionalism || 0)}%</p>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-pink-500" style={{ width: `${assessment.professionalism || 0}%` }} />
                  </div>
                </div>
              </div>

              {/* AI Summary */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2">
                   <AlertCircle size={14} /> Neural Performance Synthesis
                </h4>
                <div className="bg-blue-500/5 border border-blue-500/10 p-8 rounded-[2rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/10 transition-all" />
                  <p className="text-gray-200 text-lg leading-relaxed font-medium italic relative z-10">
                    "{assessment.aiSummary || "The candidate demonstrated high adaptability and a deep understanding of architectural patterns, specifically in scalable microservices."}"
                  </p>
                </div>
              </div>

              {/* Interaction Log */}
              <div className="space-y-6">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
                   <MessageSquare size={14} /> Assessment Interaction Log
                </h4>
                <div className="space-y-4">
                  {assessment.questions?.map((q: any, i: number) => {
                    const answer = assessment.answers?.find((a: any) => a.questionId === q.questionId);
                    return (
                      <div key={i} className="bg-[#161b22] border border-gray-800 p-6 rounded-2xl space-y-4 hover:border-gray-700 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 font-bold text-xs border border-blue-500/20">
                            Q{i + 1}
                          </div>
                          <p className="text-white font-bold text-sm leading-relaxed">{q.questionText}</p>
                        </div>
                        {answer ? (
                          <div className="pl-12 space-y-4">
                            <div className="bg-black/40 p-4 rounded-xl border border-gray-800">
                              <p className="text-gray-400 text-xs italic leading-relaxed">
                                {answer.transcription || "Response transcribed via neural layer..."}
                              </p>
                            </div>
                            {answer.responseAudioUrl && (
                               <div className="flex items-center gap-4 bg-gray-900/50 p-3 rounded-lg w-fit border border-gray-800">
                                 <button className="p-2 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500/20 transition-all">
                                   <Play fill="currentColor" size={14} />
                                 </button>
                                 <div className="w-24 h-1 bg-gray-800 rounded-full overflow-hidden">
                                   <div className="h-full bg-blue-500/50 w-1/3" />
                                 </div>
                                 <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1">
                                   <Mic size={10} /> Audio Signal
                                 </span>
                               </div>
                            )}
                          </div>
                        ) : (
                          <div className="pl-12">
                             <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">No response captured</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!error && (
            <div className="p-8 border-t border-gray-800 bg-gray-900/30 flex justify-end gap-4 shrink-0">
               <button onClick={onClose} className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white text-sm font-bold transition-all border border-gray-700">
                 Close Report
               </button>
               <button onClick={() => window.print()} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
                 Export Dossier
               </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentReportModal;
