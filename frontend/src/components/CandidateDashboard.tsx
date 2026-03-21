import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Target, TrendingUp, BookOpen, AlertCircle, Wand2 } from 'lucide-react';

const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    fetchMyMatches();
  }, []);

  const fetchMyMatches = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/matches/candidate', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setMatches(data);
    } catch (error) {
      console.error(error);
    }
  };

  const [tailoringId, setTailoringId] = useState<string | null>(null);
  const [tailoredResumes, setTailoredResumes] = useState<{ [key: string]: string }>({});

  const handleAutoTailor = async (matchId: string) => {
    setTailoringId(matchId);
    try {
      const { data } = await axios.post(`http://localhost:5000/api/matches/${matchId}/tailor`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setTailoredResumes({ ...tailoredResumes, [matchId]: data.tailoredSummary });
    } catch (error) {
      console.error('Tailor error', error);
    }
    setTailoringId(null);
  };

  const [copySuccess, setCopySuccess] = useState(false);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-3xl md:text-4xl font-black dark:text-gray-100 text-gray-900 tracking-tight">Career Insights</h2>
        <p className="dark:text-gray-400 text-gray-600 font-medium tracking-wide">Your AI-driven skill gap analysis and role fit.</p>
      </div>

      {matches.length === 0 ? (
        <div className="p-12 text-center dark:bg-[#161b22] bg-white rounded-2xl border-2 dark:border-gray-800 border-gray-200 border-dashed transition-colors">
          <p className="text-lg dark:text-gray-400 text-gray-600 mb-2">No match insights available yet.</p>
          <p className="text-sm dark:text-gray-500 text-gray-500">Upload a resume to see how you fit against open roles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {matches.map((match) => (
            <div key={match._id} className="dark:bg-[#161b22] bg-white border dark:border-gray-800 border-gray-200 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

              <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b dark:border-gray-800/60 border-gray-200 pb-6 mb-6">
                <div>
                  <h3 className="text-2xl font-bold dark:text-white text-gray-900 mb-2">{match.roleId?.title || 'Open Role'}</h3>
                  <p className="dark:text-gray-400 text-gray-600 text-sm">Department: <span className="font-medium dark:text-gray-300 text-gray-700">{match.roleId?.department || 'N/A'}</span></p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div className="flex flex-col">
                    <span className="text-4xl font-black bg-gradient-to-br from-blue-400 to-indigo-400 bg-clip-text text-transparent">{match.overallScore}%</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">Match Score</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div>
                    <h4 className="text-lg font-semibold dark:text-gray-300 text-gray-700 flex items-center gap-2 mb-3">
                      <Target className="text-blue-500 w-5 h-5" /> Your Strengths
                    </h4>
                    <div className="dark:bg-[#0d1117] bg-gray-50 rounded-xl p-5 border dark:border-gray-800/50 border-gray-200 shadow-inner h-32 overflow-y-auto transition-colors">
                      <ul className="text-sm dark:text-gray-400 text-gray-600 space-y-2 list-disc ml-4 marker:text-blue-500/50">
                        {match.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  </div>

                  {match.alternateRoleFlag && (
                    <div className="dark:bg-indigo-500/10 bg-indigo-50 border dark:border-indigo-500/30 border-indigo-200 rounded-xl p-5 flex gap-4 items-start shadow-inner">
                      <TrendingUp className="text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-indigo-600 dark:text-indigo-400 font-semibold mb-1">Career Pivot Suggestion</h4>
                        <p className="text-sm dark:text-gray-300 text-gray-700 leading-relaxed">
                          Your profile strongly aligns with <span className="font-bold dark:text-white text-gray-900">{match.recommendedAlternateRoleId?.title || 'another role'}</span>. Consider exploring this path!
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  <div>
                    <h4 className="text-lg font-semibold dark:text-gray-300 text-gray-700 flex items-center gap-2 mb-3">
                      <AlertCircle className="text-yellow-500 w-5 h-5" /> Skill Gaps
                    </h4>
                    <div className="dark:bg-[#0d1117] bg-gray-50 rounded-xl p-5 border dark:border-gray-800/50 border-gray-200 shadow-inner h-32 overflow-y-auto transition-colors">
                      <div className="flex flex-wrap gap-2">
                        {match.missingSkills?.map((skill: string, i: number) => (
                          <span key={i} className="dark:bg-yellow-500/10 bg-yellow-100 border dark:border-yellow-500/20 border-yellow-200 text-yellow-600 dark:text-yellow-500 px-3 py-1 rounded-md text-sm font-medium shadow-sm">
                            {skill}
                          </span>
                        ))}
                        {(!match.missingSkills || match.missingSkills.length === 0) && (
                          <span className="dark:text-gray-500 text-gray-500 text-sm">No critical gaps identified!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold dark:text-gray-300 text-gray-700 flex items-center gap-2 mb-3">
                      <BookOpen className="text-green-500 w-5 h-5" /> Recommended Roadmap
                    </h4>
                    <div className="dark:bg-[#0d1117] bg-gray-50 rounded-xl p-5 border dark:border-gray-800/50 border-gray-200 shadow-inner transition-colors">
                      <p className="text-sm dark:text-gray-400 text-gray-600 leading-relaxed mb-3">
                        {match.explanation}
                      </p>
                      {match.missingSkills?.length > 0 && (
                        <p className="text-sm dark:text-gray-300 text-gray-700 border-t dark:border-gray-800 border-gray-200 pt-3">
                          <strong className="text-green-500">Suggested Action:</strong> Build a mini-project focused entirely on {match.missingSkills.slice(0, 2).join(' and ')} to rapidly improve your fit for this role.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t dark:border-gray-800 border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold dark:text-gray-300 text-gray-700 flex items-center gap-2">
                    <Wand2 className="text-purple-500 w-5 h-5" /> AI Resume Auto-Tailor
                  </h4>
                  {!tailoredResumes[match._id] && (
                    <button
                      onClick={() => handleAutoTailor(match._id)}
                      disabled={tailoringId === match._id}
                      className={`px-4 py-2 ${tailoringId === match._id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-600/20'} bg-purple-600/10 text-purple-500 dark:text-purple-400 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2`}
                    >
                      {tailoringId === match._id ? 'Generating...' : 'Optimize Resume'}
                    </button>
                  )}
                </div>

                {tailoredResumes[match._id] && (
                  <div className="dark:bg-purple-500/5 bg-purple-50 rounded-xl p-5 border dark:border-purple-500/20 border-purple-200">
                    <p className="text-sm dark:text-gray-300 text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {tailoredResumes[match._id]}
                    </p>
                    <button
                      onClick={() => handleCopy(tailoredResumes[match._id])}
                      className="mt-3 text-xs text-purple-500 font-semibold hover:underline"
                    >
                      {copySuccess ? '✓ Copied to Clipboard' : 'Copy to Clipboard'}
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end">
                <button
                  onClick={() => navigate(`/assessment/${match._id}`)}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95"
                >
                  Take Pre-Screening Assessment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
