import React from 'react';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ComparisonModalProps {
  candidates: any[];
  onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ candidates, onClose }) => {
  const [a, b] = candidates;

  const rows = [
    { label: 'Overall Match Score', valA: `${a.overallScore}%`, valB: `${b.overallScore}%`, numA: a.overallScore, numB: b.overallScore },
    { label: 'Skills Fit', valA: `${a.dimensionScores?.skills ?? '--'}%`, valB: `${b.dimensionScores?.skills ?? '--'}%`, numA: a.dimensionScores?.skills, numB: b.dimensionScores?.skills },
    { label: 'Experience Depth', valA: `${a.dimensionScores?.experience ?? '--'}%`, valB: `${b.dimensionScores?.experience ?? '--'}%`, numA: a.dimensionScores?.experience, numB: b.dimensionScores?.experience },
    { label: 'Project Relevance', valA: `${a.dimensionScores?.projects ?? '--'}%`, valB: `${b.dimensionScores?.projects ?? '--'}%`, numA: a.dimensionScores?.projects, numB: b.dimensionScores?.projects },
    { label: 'Education Alignment', valA: `${a.dimensionScores?.education ?? '--'}%`, valB: `${b.dimensionScores?.education ?? '--'}%`, numA: a.dimensionScores?.education, numB: b.dimensionScores?.education },
    { label: 'Flight Risk', valA: a.flightRisk || 'Low', valB: b.flightRisk || 'Low', numA: a.flightRisk === 'High' ? 0 : a.flightRisk === 'Medium' ? 0.5 : 1, numB: b.flightRisk === 'High' ? 0 : b.flightRisk === 'Medium' ? 0.5 : 1 },
  ];

  const getWinner = (numA: number, numB: number) => {
    if (numA > numB) return 'A';
    if (numB > numA) return 'B';
    return 'tie';
  };

  const nameA = a.candidateName || (a.candidateId as any)?.name || 'Candidate A';
  const nameB = b.candidateName || (b.candidateId as any)?.name || 'Candidate B';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="dark:bg-[#161b22] bg-white border dark:border-gray-800 border-gray-200 rounded-2xl shadow-2xl w-full max-w-3xl animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-xl">Side-by-Side Comparison</h2>
            <p className="text-blue-200 text-sm">Evaluating top candidates head-to-head</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="dark:bg-[#0d1117] bg-gray-50 border-b dark:border-gray-800 border-gray-200">
                <th className="p-4 text-left dark:text-gray-500 text-gray-500 font-semibold uppercase tracking-wider text-xs w-1/3">Attribute</th>
                <th className="p-4 text-center dark:text-gray-200 text-gray-900 font-bold text-base">{nameA}</th>
                <th className="p-4 text-center dark:text-gray-200 text-gray-900 font-bold text-base">{nameB}</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800 divide-gray-100">
              {rows.map((row) => {
                const winner = getWinner(row.numA ?? 0, row.numB ?? 0);
                return (
                  <tr key={row.label} className="dark:hover:bg-gray-800/30 hover:bg-gray-50 transition-colors">
                    <td className="p-4 dark:text-gray-400 text-gray-600 font-medium">{row.label}</td>
                    <td className={`p-4 text-center font-bold text-lg ${winner === 'A' ? 'text-green-500' : winner === 'tie' ? 'dark:text-gray-300 text-gray-700' : 'dark:text-gray-500 text-gray-400'}`}>
                      <span className="flex items-center justify-center gap-1.5">
                        {winner === 'A' && <TrendingUp size={16} />}
                        {winner === 'B' && <TrendingDown size={16} />}
                        {winner === 'tie' && <Minus size={16} />}
                        {row.valA}
                      </span>
                    </td>
                    <td className={`p-4 text-center font-bold text-lg ${winner === 'B' ? 'text-green-500' : winner === 'tie' ? 'dark:text-gray-300 text-gray-700' : 'dark:text-gray-500 text-gray-400'}`}>
                      <span className="flex items-center justify-center gap-1.5">
                        {winner === 'B' && <TrendingUp size={16} />}
                        {winner === 'A' && <TrendingDown size={16} />}
                        {winner === 'tie' && <Minus size={16} />}
                        {row.valB}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 dark:bg-[#0d1117] bg-gray-50 border-t dark:border-gray-800 border-gray-200 text-xs dark:text-gray-500 text-gray-500 text-center">
          🏆 Green values indicate the stronger candidate in each category.
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
