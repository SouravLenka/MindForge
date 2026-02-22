import { useState, useEffect } from 'react';
import { getInsights } from '../services/api';

export default function Insights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const insights = await getInsights();
        setData(insights);
      } catch (err) {
        setError(err.friendlyMessage || 'Failed to fetch insights data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="background-aurora" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-slate-400 font-medium animate-pulse">Loading MindForge Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 relative overflow-hidden">
      <div className="background-aurora" />

      {/* Header */}
      <div className="relative z-10 max-w-4xl mx-auto mb-16 text-center">
        <h2 className="text-5xl font-extrabold text-foreground mb-4 tracking-tight">Session Intelligence</h2>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          High-fidelity metrics tracking your interaction with MindForge AI.
        </p>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        
        {/* Top Row: KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Total Questions Hero Card */}
          <div className="glass-card p-10 flex flex-col items-center justify-center text-center group relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700" />
            <p className="text-[11px] font-bold text-muted uppercase tracking-[0.2em] mb-4">Total Interactions</p>
            <h3 className="text-8xl font-black text-foreground group-hover:scale-110 transition-transform duration-500 tracking-tighter">
              {data?.total_questions || 0}
            </h3>
            <div className="mt-8 px-6 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-bold uppercase tracking-[0.1em]">
              Real-time Analysis
            </div>
          </div>

          {/* System Status Card */}
          <div className="glass-card p-10 flex flex-col items-center justify-center text-center group relative overflow-hidden">
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
            <p className="text-[11px] font-bold text-muted uppercase tracking-[0.2em] mb-4">Core Engine Status</p>
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              <h3 className="text-6xl font-black text-foreground group-hover:tracking-wider transition-all duration-500 uppercase">
                Active
              </h3>
            </div>
            <div className="mt-8 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-[0.1em]">
              Verified Grounding
            </div>
          </div>
        </div>

        {/* Learning Modes Optimized Section */}
        <div className="glass-card p-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h4 className="text-xs font-bold text-muted uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Explanation Modalities
              </h4>
              <p className="text-[11px] text-muted mt-1 uppercase tracking-widest font-bold">Frequency distribution of selected modes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.keys(data?.mode_usage || {}).length === 0 ? (
               <div className="col-span-full py-20 text-center glass-card bg-white/5 border-dashed border-white/10">
                 <p className="text-slate-500 italic text-sm">No interaction patterns logged yet. Ask some questions in Chat!</p>
               </div>
            ) : (
              Object.entries(data?.mode_usage || {}).map(([mode, count], i) => (
                <div key={i} className="flex flex-col gap-4 p-6 glass-card bg-white/5 border-white/5 group hover:bg-white/10 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                      {count}
                    </div>
                    <div className="px-2 py-1 rounded-md bg-white/5 text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                      Usage Unit
                    </div>
                  </div>
                  <div>
                    <p className="text-md font-bold text-slate-100 group-hover:text-white transition-colors tracking-tight">{mode}</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.15em] mt-1">Cognitive Mode</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 glass-card bg-red-500/10 border-red-500/20 px-8 py-4 text-red-400 text-sm font-medium animate-float">
          {error}
        </div>
      )}
    </div>
  );
}
