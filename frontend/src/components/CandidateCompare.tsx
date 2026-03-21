import React from 'react';
import { X, Check, Activity, BookOpen, Briefcase, Award } from 'lucide-react';

interface CompareProps {
  candidates: any[];
  onClose: () => void;
}

const CandidateCompare: React.FC<CompareProps> = ({ candidates, onClose }) => {
  if (!candidates || candidates.length < 2) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="dark:bg-[#161b22] bg-white border dark:border-gray-800 border-gray-200 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative">
        <div className="sticky top-0 px-6 py-5 border-b dark:border-gray-800 border-gray-200 dark:bg-[#161b22]/95 bg-white/95 backdrop-blur flex justify-between items-center z-10">
          <div>
            <h3 className="text-xl font-bold dark:text-gray-100 text-gray-900">Compare Candidates</h3>
            <p className="dark:text-gray-400 text-gray-500 text-sm">Side-by-side analysis for final hiring decision</p>
          </div>
          <button onClick={onClose} className="p-2 dark:hover:bg-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="dark:text-gray-400 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1 border-r dark:border-gray-800 border-gray-200 pr-6">
              <h4 className="font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider text-xs mb-8 mt-2">Evaluation Metrics</h4>
              <div className="space-y-12">
                <div className="font-medium dark:text-gray-300 text-gray-700">Overall Match Score</div>
                <div className="font-medium dark:text-gray-300 text-gray-700">Skills Alignment</div>
                <div className="font-medium dark:text-gray-300 text-gray-700">Project Quality</div>
                <div className="font-medium dark:text-gray-300 text-gray-700">Experience Map</div>
                <div className="font-medium dark:text-gray-300 text-gray-700">Education Fit</div>
              </div>
            </div>

            {candidates.slice(0, 2).map((candidate, idx) => (
              <div key={idx} className="col-span-1 px-2 relative">
                <div className="mb-8">
                   <h3 className="text-xl font-bold text-blue-500 mb-1">{candidate.candidateName || (candidate.candidateId as any)?.name || 'Applicant'}</h3>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium dark:bg-emerald-500/10 bg-emerald-100 text-emerald-500 border dark:border-emerald-500/20 border-emerald-200">
                    <Check size={14} /> Shortlisted
                  </div>
                </div>

                <div className="space-y-12">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-black dark:text-white text-gray-900">{candidate.overallScore}%</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="dark:text-gray-400 text-gray-600">Score</span>
                      <span className="font-semibold dark:text-gray-200 text-gray-800">{candidate.dimensionScores?.skills}%</span>
                    </div>
                    <div className="h-2 w-full dark:bg-gray-800 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${candidate.dimensionScores?.skills}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="dark:text-gray-400 text-gray-600">Score</span>
                      <span className="font-semibold dark:text-gray-200 text-gray-800">{candidate.dimensionScores?.projects}%</span>
                    </div>
                    <div className="h-2 w-full dark:bg-gray-800 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${candidate.dimensionScores?.projects}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="dark:text-gray-400 text-gray-600">Score</span>
                      <span className="font-semibold dark:text-gray-200 text-gray-800">{candidate.dimensionScores?.experience}%</span>
                    </div>
                    <div className="h-2 w-full dark:bg-gray-800 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${candidate.dimensionScores?.experience}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="dark:text-gray-400 text-gray-600">Score</span>
                      <span className="font-semibold dark:text-gray-200 text-gray-800">{candidate.dimensionScores?.education}%</span>
                    </div>
                    <div className="h-2 w-full dark:bg-gray-800 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${candidate.dimensionScores?.education}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-500/5 dark:bg-blue-500/5 border border-blue-500/20 p-5 rounded-xl">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-500 mb-4 uppercase tracking-wider">
              <Activity size={16} /> AI Recommendation
            </h4>
            <div className="grid grid-cols-2 gap-8 pl-80">
              {candidates.slice(0, 2).map((candidate, idx) => (
                <div key={`rec-${idx}`}>
                  <p className="dark:text-gray-300 text-gray-700 text-sm leading-relaxed">
                    {candidate.explanation || "Strong candidate across foundational technical dimensions. Requires further behavioral screening via audio assessment."}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CandidateCompare;
