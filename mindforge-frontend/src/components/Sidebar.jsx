const MODES = ['Quick Answer', 'Step-by-Step'];
const LEVELS = ['Basic', 'Intermediate', 'Advanced'];

export default function Sidebar({ mode, setMode, level, setLevel, language, setLanguage, uploadedFiles }) {
  return (
    <aside className="w-80 h-full frosted-glass flex flex-col overflow-y-auto custom-scrollbar transition-all duration-300">
      <div className="p-6 flex flex-col gap-8">

        {/* Header */}
        <div>
          <h2 className="text-[11px] font-bold text-foreground uppercase tracking-[0.2em] mb-1">Context Controls</h2>
          <div className="h-0.5 w-10 bg-purple-500/50 rounded-full" />
        </div>

        {/* Explanation Mode */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Explanation Mode</label>
          <div className="flex flex-col gap-2">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium border transition-all duration-300 ${mode === m
                  ? 'bg-purple-600/20 border-purple-500/40 text-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                  : 'bg-background/50 border-card-border text-muted hover:bg-white/10 hover:border-purple-500/20 hover:text-foreground'
                  }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Response Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-background/50 border border-card-border text-foreground text-xs font-medium px-4 py-2.5 rounded-xl focus:outline-none focus:border-purple-500/40 transition-all duration-300"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
            <option value="Japanese">Japanese</option>
            <option value="Russian">Russian</option>
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3 block">Difficulty Level</label>
          <div className="flex gap-2 p-1 bg-background/50 rounded-xl border border-card-border">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${level === l
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-500 hover:text-white'
                  }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Uploaded Files */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Uploaded Files</label>
          <div className="flex flex-col gap-2">
            {uploadedFiles.length === 0 ? (
              <p className="text-[11px] text-slate-600 italic px-1">No files indexed yet.</p>
            ) : (
              uploadedFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-3 glass-card bg-white/5 border-white/5 p-3 group hover:bg-white/10 transition-all cursor-default">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate font-medium">{file}</p>
                    <p className="text-[10px] text-muted">PDF Document</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Context Footer */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Active Context</label>
          <div className="flex flex-wrap gap-2">
            {[mode, level, language].filter(Boolean).map((chip, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full bg-purple-600/15 border border-purple-500/20 text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                {chip}
              </span>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}
