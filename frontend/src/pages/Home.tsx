import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  Users,
  Target,
  Sparkles,
  ShieldCheck,
  Calendar,
  ChevronRight,
  ArrowRight,
  Zap,
  CheckCircle,
  TrendingUp,
  LayoutGrid,
  Bot,
  Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <BrainCircuit className="w-6 h-6 text-blue-400" />,
      title: "AI Multi-Role Matcher",
      desc: "Instantly analyze a single resume against hundreds of open roles with precision scoring."
    },
    {
      icon: <Bot className="w-6 h-6 text-purple-400" />,
      title: "Intervew Simulator",
      desc: "Talk to a candidate's AI persona! Run mock technical and behavioral interviews before calling them."
    },
    {
      icon: <LayoutGrid className="w-6 h-6 text-emerald-400" />,
      title: "AI Role Generator",
      desc: "Generate professional job descriptions and requirement lists from a simple title in seconds."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-orange-400" />,
      title: "Bias-Free Screening",
      desc: "Enable DE&I with blind screening modes and AI-powered bias detection in descriptions."
    },
    {
      icon: <Target className="w-6 h-6 text-pink-400" />,
      title: "Smart Summarization",
      desc: "Get professional AI bios for every candidate, highlighting core strengths automatically."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
      title: "Recruiter Copilot",
      desc: "A real-time AI assistant to find the best talent and answer complex queries instantly."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500/10 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] animate-pulse delay-700" />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-32 relative">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium text-sm backdrop-blur-md mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Hiring Intelligence Beyond Resume Screening</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1]"
          >
            Match talent <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">smarter</span>,<br />
            hire <span className="underline decoration-blue-500/30 underline-offset-8">faster</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Evaluate resumes across multiple roles, generate explainable AI scorecards,
            and automate your entire recruitment workflow in one unified platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center pt-8"
          >
            {user ? (
              <Link to="/dashboard" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-2xl shadow-blue-500/30 flex items-center gap-2 group">
                Enter Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-2xl shadow-blue-500/30 flex items-center gap-2 group">
                  Get Started Free
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="px-8 py-4 bg-[#161b22] hover:bg-[#1f242d] border border-gray-800 text-gray-300 rounded-2xl font-bold transition-all backdrop-blur-sm">
                  Login to Demo
                </Link>
              </>
            )}
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-12 pt-20 border-t dark:border-gray-800/10 border-gray-200/50"
          >
            {[
              { label: "Resumes Tested", value: "100+" },
              { label: "AI Accuracy", value: "80%" },
              { label: "Hiring Time Saved", value: "70%" },
              { label: "Matched Roles", value: "50+" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black dark:text-white text-gray-900 mb-1">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] dark:text-gray-500 text-gray-400 font-bold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* How it Works Section */}
        <div className="mb-48 relative">
          {/* Decorative background glow for this section */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 blur-[120px] -z-10" />

          <div className="text-center mb-24 space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black dark:text-white text-gray-900 tracking-tight"
            >
              How <span className="text-blue-500">TalentLens</span> Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="dark:text-gray-400 text-gray-600 max-w-xl mx-auto font-medium text-lg"
            >
              From role creation to interview simulation, automate every step.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-[45%] left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -z-10" />

            {[
              {
                step: "01",
                title: "Define Your Role",
                desc: "Use AI to generate professional job descriptions and skill requirements in seconds.",
                icon: <LayoutGrid className="w-8 h-8 text-blue-400" />,
                gradient: "from-blue-500/20 to-indigo-500/20"
              },
              {
                step: "02",
                title: "Upload & Analyze",
                desc: "Batch upload resumes to get instant AI summaries and precision match scores.",
                icon: <Upload className="w-8 h-8 text-purple-400" />,
                gradient: "from-purple-500/20 to-pink-500/20"
              },
              {
                step: "03",
                title: "Simulate & Hire",
                desc: "Run mock interviews with AI-Personas and schedule top candidates with one click.",
                icon: <Zap className="w-8 h-8 text-orange-400" />,
                gradient: "from-orange-500/20 to-rose-500/20"
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * i }}
                whileHover={{ y: -10 }}
                className="relative group h-full"
              >
                <div className="relative h-full p-10 rounded-[3rem] dark:bg-[#161b22] bg-white border dark:border-gray-800 border-gray-200 shadow-2xl transition-all duration-500 group-hover:border-blue-500/40 flex flex-col items-center text-center overflow-hidden">
                  {/* Subtle Top Gradient */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient} opacity-50`} />

                  {/* Step Number Background */}
                  <div className="absolute -top-6 -right-6 text-9xl font-black dark:text-white/[0.03] text-gray-900/[0.03] pointer-events-none select-none">
                    {step.step}
                  </div>

                  <div className="w-20 h-20 rounded-3xl dark:bg-[#0d1117] bg-gray-50 border dark:border-gray-700 border-gray-200 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl relative z-10">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative z-10">{step.icon}</div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full dark:bg-blue-500/10 bg-blue-50 dark:text-blue-400 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-2 border dark:border-blue-500/20 border-blue-200">
                      Step {step.step}
                    </div>
                    <h4 className="text-2xl font-black dark:text-white text-gray-900">{step.title}</h4>
                    <p className="dark:text-gray-400 text-gray-600 leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
              whileHover={{ 
                y: -12, 
                transition: { duration: 0.4, ease: "easeOut" } 
              }}
              className="group relative p-10 rounded-[2.5rem] transition-all duration-500 h-full flex flex-col bg-[#161b22] border border-gray-800 hover:border-blue-500/50 hover:shadow-[0_40px_80px_rgba(59,130,246,0.15)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />
              <div className="relative z-10 flex flex-col h-full text-center items-center">
                {/* Icon Container with multi-layered glow */}
                <div className="mb-8 relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-60 transition-opacity" />
                  <div className="w-20 h-20 rounded-3xl bg-[#0d1117] border border-gray-800 flex items-center justify-center relative z-20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    {feature.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-blue-500 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-400 leading-relaxed text-base font-medium">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="mt-48 mb-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black dark:text-white text-gray-900 mb-6">Trusted by <span className="text-gradient">Industry Leaders</span></h2>
            <p className="dark:text-gray-400 text-gray-600 max-w-xl mx-auto font-medium">Decisions powered by neural intelligence, validated by top recruiters.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Head of Talent, TechFlow",
                text: "The AI Persona simulator is a game changer. We save 15+ hours a week on preliminary technical screenings.",
                avatar: "SC"
              },
              {
                name: "Marcus Wright",
                role: "Senior Recruiter, Global Dynamics",
                text: "The multi-role matcher finally solved our problem of discovering hidden talent across overlapping mandates.",
                avatar: "MW"
              },
              {
                name: "Elena Rodriguez",
                role: "Director of HR, Visionary AI",
                text: "Unbiased, fast, and incredibly intuitive. TalentLens isn't just a tool; it's our strategic hiring copilot.",
                avatar: "ER"
              }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-3xl border-white/5 bg-white/5 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{review.name}</h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{review.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed">
                  "{review.text}"
                </p>
                <div className="flex gap-1 mt-6">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-12 rounded-[3.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden shadow-2xl shadow-blue-500/20"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32" />
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-white">Ready to hire your next star?</h2>
            <p className="text-blue-100 text-lg max-w-xl font-medium">
              Join hundreds of forward-thinking recruiters using TalentLens to transform their pipeline.
            </p>
            <Link to="/register" className="mt-4 px-10 py-5 bg-white text-blue-700 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl">
              Join Today - It's Free
            </Link>
          </div>
        </motion.div>

        {/* Informative Footer Sections */}
        <div className="mt-32 pt-20 border-t border-slate-200 dark:border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                  <BrainCircuit className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-black dark:text-white text-gray-900 tracking-tighter uppercase">Talent<span className="text-blue-500">Lens</span> AI</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm font-medium leading-relaxed">
                Empowering the next generation of recruitment with neural intelligence and ethical AI matching protocols.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Platform</h4>
              <ul className="space-y-4">
                <li><Link to="/dashboard" className="text-sm text-slate-500 hover:text-blue-500 transition-colors font-medium">Recruiter Workspace</Link></li>
                <li><Link to="/roles" className="text-sm text-slate-500 hover:text-blue-500 transition-colors font-medium">Mandate Management</Link></li>
                <li><Link to="/analytics" className="text-sm text-slate-500 hover:text-blue-500 transition-colors font-medium">Neural Analytics</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Company</h4>
              <ul className="space-y-4">
                <li><Link to="#" className="text-sm text-slate-500 hover:text-blue-500 transition-colors font-medium">Privacy Policy</Link></li>
                <li><Link to="#" className="text-sm text-slate-500 hover:text-blue-500 transition-colors font-medium">Terms of Signal</Link></li>
                <li><Link to="#" className="text-sm text-slate-500 hover:text-blue-500 transition-colors font-medium">Contact Protocol</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
