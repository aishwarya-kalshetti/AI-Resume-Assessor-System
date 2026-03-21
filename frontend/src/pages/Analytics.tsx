import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Users, FileText, CheckCircle, ArrowUpRight, Target, Activity, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [metrics, setMetrics] = useState<any>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/analytics/metrics', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setMetrics(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMetrics();
  }, [user]);

  if (!metrics) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-gray-500 font-semibold tracking-widest uppercase text-xs">Synthesizing Pipeline Intelligence...</p>
    </div>
  );

  // Premium SaaS Color Palette
  const COLORS = {
    primary: ['#6366f1', '#818cf8'], // Indigo
    secondary: ['#10b981', '#34d399'], // Emerald
    accent: ['#f59e0b', '#fbbf24'], // Amber
    info: ['#8b5cf6', '#a78bfa'], // Violet
  };

  const CHART_COLORS = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b'];

  const stats = [
    { label: 'Avg Match Fit', value: `${metrics.avgScore}%`, icon: Target, color: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-500/10' },
    { label: 'Total Matches', value: metrics.totalMatches, icon: Users, color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500/10' },
    { label: 'Resumes', value: metrics.totalResumes, icon: FileText, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-500/10' },
    { label: 'Active Roles', value: metrics.totalRoles, icon: Zap, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="min-h-screen bg-transparent pt-10 pb-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="bg-glow glow-blue w-[500px] h-[500px] -top-40 -left-20 text-indigo-500" />
      <div className="bg-glow glow-purple w-[400px] h-[400px] bottom-0 -right-20 text-violet-500" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium tracking-wider uppercase">
              Neural Intelligence
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium tracking-wider uppercase">
              Precision Data
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-slate-900 dark:text-white">
                Recruitment <span className="text-gradient">Analytics</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg font-medium">
                Leverage AI-driven insights to monitor candidate pipeline velocity, match accuracy, and hiring efficiency across all active roles.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold dark:bg-gray-800/50 bg-white border dark:border-gray-700 border-slate-200 px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              LATEST SYNC: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card group relative p-6 rounded-[2rem] hover-lift">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-bl-[5rem] group-hover:opacity-[0.07] transition-opacity`}></div>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
                  <stat.icon size={22} className="text-indigo-500" />
                </div>
                <ArrowUpRight size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black tracking-[0.15em] uppercase mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black dark:text-white text-slate-900 tabular-nums tracking-tighter">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Main Area Chart */}
          <div className="xl:col-span-3 glass-card p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-black dark:text-white text-slate-900 tracking-tight leading-none mb-2">Candidate Flow Velocity</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">AI Pipeline Status Distribution</p>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.pipeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1a202c" : "#f1f5f9"} vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke={isDark ? "#4b5563" : "#94a3b8"} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }} 
                    dy={10}
                  />
                  <YAxis 
                    stroke={isDark ? "#4b5563" : "#94a3b8"} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11 }}
                  />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0d1117' : '#ffffff', 
                      border: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`, 
                      borderRadius: '16px', 
                      color: isDark ? '#fff' : '#111827', 
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                      padding: '12px'
                    }}
                    itemStyle={{ fontWeight: 800, fontSize: '14px' }}
                    cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#6366f1" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorVal)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Pie Chart / Distribution */}
          <div className="xl:col-span-2 glass-card p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col">
            <div className="mb-8">
              <h3 className="text-xl font-black dark:text-white text-slate-900 tracking-tight leading-none mb-2">Stage Allocation</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Resource Distribution Mix</p>
            </div>
            
            <div className="flex-1 min-h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.pipeline}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1500}
                  >
                    {metrics.pipeline.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                        className="hover:opacity-80 transition-opacity outline-none" 
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0d1117' : '#ffffff', 
                      border: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`, 
                      borderRadius: '16px', 
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Legend Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black dark:text-white text-slate-900 leading-none">{metrics.totalMatches}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Total Hits</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {metrics.pipeline.map((stage: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}></div>
                  <span className="text-xs font-bold dark:text-slate-300 text-slate-600 truncate">{stage.name}</span>
                  <span className="text-xs font-black text-slate-400 ml-auto">{stage.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
