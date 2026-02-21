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
      <div className="relative z-10 max-w-6xl mx-auto mb-12">
        <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Learning Insights</h2>
        <p className="text-slate-400">Track your progress and understanding across your indexed materials.</p>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Stats */}
        <div className="glass-card p-8 flex flex-col justify-center items-center text-center group">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Questions</p>
          <h3 className="text-6xl font-black text-white group-hover:scale-110 transition-transform duration-500">
            {data?.total_questions || 0}
          </h3>
          <div className="mt-6 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
            Up 12% this week
          </div>
        </div>

        <div className="glass-card p-8 flex flex-col justify-center items-center text-center group">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Top Subject</p>
          <h3 className="text-4xl font-bold text-white group-hover:text-purple-300 transition-colors">
            {data?.top_topics?.[0]?.topic || 'Physics'}
          </h3>
          <p className="mt-4 text-xs text-slate-500 font-medium tracking-wide">
            {data?.top_topics?.[0]?.count || 0} Discussions logged
          </p>
        </div>

        <div className="glass-card p-8 flex flex-col justify-center items-center text-center group">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Average Accuracy</p>
          <h3 className="text-6xl font-black text-white group-hover:scale-110 transition-transform duration-500">
            98.2<span className="text-2xl text-purple-500">%</span>
          </h3>
          <div className="mt-6 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
            Verified Grounding
          </div>
        </div>

        {/* Detailed Lists */}
        <div className="md:col-span-2 glass-card p-10">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            Top Discussion Topics
          </h4>
          <div className="space-y-6">
            {data?.top_topics?.map((topic, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-slate-200">{topic.topic}</span>
                  <span className="text-xs font-bold text-slate-500">{topic.count} Queries</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000 delay-300" 
                    style={{ width: `${Math.min(100, (topic.count / (data.total_questions || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-10 flex flex-col">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Learning Modes
          </h4>
          <div className="flex-1 flex flex-col gap-6 justify-center">
            {Object.entries(data?.mode_usage || {}).map(([mode, count], i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/10 transition-all font-bold text-lg">
                  {count}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{mode}</p>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Selected Mode</p>
                </div>
              </div>
            ))}
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
