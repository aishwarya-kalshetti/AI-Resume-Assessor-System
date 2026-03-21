import React, { useRef } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { CheckCircle, XCircle, AlertTriangle, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ScorecardProps {
  match: any;
}

const Scorecard: React.FC<ScorecardProps> = ({ match }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const printRef = useRef<HTMLDivElement>(null);

  if (!match) return null;

  const candidateName = (match.candidateId as any)?.name || 'Candidate';

  const handleExportPDF = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open('', '', 'width=900,height=700');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>AI Scorecard – ${candidateName}</title>
          <style>
            body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 32px; color: #1f2937; background: white; }
            h1 { font-size: 22px; font-weight: 800; margin:0 0 4px; }
            p.sub { color: #6b7280; margin: 0 0 24px; }
            .score { font-size: 48px; font-weight: 900; color: #3b82f6; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
            .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
            .card h4 { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.1em; margin: 0 0 10px; }
            .dim { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6; }
            .dim span { color: #374151; font-weight: 600; }
            .strengths li { color: #059669; font-size: 13px; margin-bottom: 4px; }
            .weaknesses li { color: #dc2626; font-size: 13px; margin-bottom: 4px; }
            .reasoning { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; font-size: 13px; color: #374151; line-height: 1.6; margin-bottom: 16px; }
            .retention { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; display:flex; justify-content: space-between; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
            @media print { body { print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <div>
              <h1>AI Match Scorecard</h1>
              <p class="sub">Candidate: <strong>${candidateName}</strong> &nbsp;|&nbsp; Generated ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="score">${match.overallScore}%</div>
          </div>
          <div class="grid">
            <div class="card">
              <h4>Dimension Scores</h4>
              ${['skills', 'experience', 'projects', 'education'].map(k => `<div class="dim"><span>${k.charAt(0).toUpperCase() + k.slice(1)}</span><span>${match.dimensionScores?.[k] ?? '--'}%</span></div>`).join('')}
            </div>
            <div class="card">
              <h4>Strengths</h4>
              <ul class="strengths">${(match.strengths || []).map((s: string) => `<li>✓ ${s}</li>`).join('')}</ul>
            </div>
            <div class="card">
              <h4>Missing / Weak Areas</h4>
              <ul class="weaknesses">${(match.weaknesses || []).map((w: string) => `<li>✗ ${w}</li>`).join('')}</ul>
            </div>
            <div class="card">
              <h4>Flight Risk</h4>
              <p style="font-size:28px;font-weight:800;color:${match.flightRisk === 'High' ? '#dc2626' : match.flightRisk === 'Medium' ? '#d97706' : '#059669'}">${match.flightRisk || 'Low'}</p>
              <p style="color:#6b7280;font-size:12px;">Probability: ${match.flightRiskProbability || 0}%</p>
            </div>
          </div>
          <div class="reasoning"><strong>AI Reasoning:</strong> ${match.explanation}</div>
          <div class="footer">TalentLens AI &nbsp;·&nbsp; Confidential Recruitment Report &nbsp;·&nbsp; Not for distribution</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  const data = [
    { subject: 'Skills', A: match.dimensionScores?.skills || 0, fullMark: 100 },
    { subject: 'Experience', A: match.dimensionScores?.experience || 0, fullMark: 100 },
    { subject: 'Projects', A: match.dimensionScores?.projects || 0, fullMark: 100 },
    { subject: 'Education', A: match.dimensionScores?.education || 0, fullMark: 100 },
  ];

  return (
    <div ref={printRef} className="glass-card rounded-[2.5rem] p-8 shadow-2xl w-full border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -ml-32 -mt-32 blur-3xl" />

      <div className="flex flex-col md:flex-row justify-between items-start mb-10 relative z-10 gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-500 mb-2 block">Neural Assessment Report</span>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">AI Match Scorecard</h3>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={handleExportPDF}
            className="btn-glass px-5 py-2.5 text-xs font-bold uppercase tracking-widest border-blue-600/20 dark:border-blue-500/20 text-blue-600 dark:text-blue-400"
          >
            <Download size={16} /> Export Intelligence
          </button>
          <div className="flex flex-col items-end">
            <div className="text-5xl font-black text-slate-900 dark:text-white bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500 bg-clip-text text-transparent leading-none">
              {match.overallScore}%
            </div>
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-500 tracking-[0.2em] uppercase mt-2">Neural Fit index</span>
          </div>
        </div>
      </div>

      {match.alternateRoleFlag && (
        <div className="mb-10 bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 flex gap-5 items-center shadow-inner relative z-10">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="text-blue-500" size={20} />
          </div>
          <div>
            <h4 className="text-blue-400 font-bold mb-1 uppercase tracking-wider text-sm">Strategic Pivot Suggested</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Candidate profile exhibits optimized resonance for adjacent mandates. Consider cross-role deployment.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
        <div className="h-80 bg-slate-50 dark:bg-black/40 rounded-3xl border border-slate-200 dark:border-white/5 p-6 flex flex-col items-center justify-center shadow-inner relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/[0.02] group-hover:bg-blue-500/[0.04] transition-colors" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-500 mb-6 relative z-10">Neural Dimension Resonance</p>
          <ResponsiveContainer width="100%" height="100%" className="relative z-10">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke={isDark ? "#ffffff10" : "#00000010"} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Candidate" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-[2rem] p-6 shadow-inner transition-all hover:bg-emerald-500/[0.05]">
            <h4 className="font-bold text-emerald-400 mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.15em]">
              <CheckCircle size={14} /> Optimized Strengths
            </h4>
            <div className="space-y-3">
              {match.strengths?.map((s: string, i: number) => (
                <div key={i} className="flex items-center gap-3 animate-in slide-in-from-left duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-sm text-slate-700 dark:text-slate-200 font-bold tracking-wide">{s}</span>
                </div>
              ))}
              {(!match.strengths || match.strengths.length === 0) && <p className="text-sm text-slate-500 dark:text-slate-400 italic font-bold">No peak signals detected.</p>}
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border-rose-500/10 bg-rose-500/[0.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500 border border-rose-500/20">
                <XCircle size={18} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">Neural Gaps Identified</h4>
            </div>
            <div className="space-y-3">
              {match.weaknesses?.length > 0 ? (
                match.weaknesses.map((w: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 animate-in slide-in-from-left duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                    <span className="text-sm text-slate-700 dark:text-slate-200 font-bold tracking-wide">{w}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic font-bold">Zero critical gaps found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-10 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-[0.3em]">AI Synthesis Reasoning</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-white/[0.03] p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-inner italic font-medium">
            "{match.explanation}"
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-[0.3em]">Predictive Signal Audit</h4>
          <div className="bg-slate-50 dark:bg-white/[0.03] p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-inner flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 dark:text-slate-500 font-black uppercase tracking-widest">Flight Risk Audit</p>
              <span className={`text-3xl font-black ${match.flightRisk === 'High' ? 'text-red-600 dark:text-red-500' : match.flightRisk === 'Medium' ? 'text-amber-600 dark:text-amber-500' : 'text-emerald-600 dark:text-emerald-500'} tracking-tight`}>
                {match.flightRisk || 'Low'}
              </span>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[10px] text-slate-500 dark:text-slate-500 font-black uppercase tracking-widest">Signal Probability</p>
              <span className="text-3xl font-black text-slate-900 dark:text-white lining-nums">{match.flightRiskProbability || 0}%</span>
            </div>
          </div>
          <p className="text-[9px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest px-2 italic opacity-60">Generated via Neural Tenure density analysis metrics.</p>
        </div>
      </div>
    </div>
  );
};

export default Scorecard;
