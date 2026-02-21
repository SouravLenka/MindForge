import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ to, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
        active
          ? 'bg-purple-600/20 text-purple-300 shadow-[0_0_20px_rgba(139,92,246,0.2)] border border-purple-500/30'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {label}
    </Link>
  );
};

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-8 border-b border-white/10"
      style={{ background: 'rgba(11,15,26,0.7)', backdropFilter: 'blur(32px) saturate(180%)' }}>
      
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 mr-10 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:scale-105 transition-transform duration-300">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="font-bold text-white text-xl tracking-tight">MindForge</span>
      </Link>

      {/* Nav Links (Centered) */}
      <div className="flex-1 flex justify-center items-center gap-2">
        <NavLink to="/" label="Home" />
        <NavLink to="/chat" label="Ask Doubt" />
        <NavLink to="/upload" label="Upload Materials" />
        <NavLink to="/insights" label="Insights" />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-5">
        <button className="text-slate-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
          </svg>
        </button>
        
        <div className="flex items-center gap-3 pl-5 border-l border-white/10">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-[0_0_15px_rgba(139,92,246,0.4)] border border-white/20">
            S
          </div>
        </div>
      </div>
    </nav>
  );
}
