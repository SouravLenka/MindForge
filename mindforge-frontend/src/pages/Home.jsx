import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FeatureCard from '../components/FeatureCard';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    if (user?.phoneNumber) return user.phoneNumber;
    return 'Learner';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden pt-20">
      
      {/* Background Layer */}
      <div className="background-aurora" />

      {/* AI-Powered Badge */}
      <div className="relative z-10 mb-8 animate-float">
        <div className="glass-card bg-background/20 border-card-border px-4 py-1.5 flex items-center gap-2 rounded-full shadow-2xl">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
            AI-Powered Learning Assistant
          </span>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 glass-card max-w-4xl w-full p-16 md:p-24 text-center mb-16 overflow-hidden">
        {/* Subtle internal glows */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-purple-600/5 blur-[120px]" />
        
        <div className="relative z-10">
          <p className="text-purple-400 font-bold mb-4 tracking-loose">
            Welcome back, {getDisplayName()}!
          </p>
          <h1 className="text-6xl md:text-7xl font-extrabold text-foreground mb-4 tracking-tight leading-tight">
            Context-Aware
          </h1>
          <h1 className="text-6xl md:text-7xl font-extrabold gradient-text mb-8 tracking-tight leading-tight">
            Doubt Resolution
          </h1>
          
          <p className="text-muted text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Syllabus-aligned. Source-grounded. No hallucinations. Get accurate answers backed by your own study materials.
          </p>
          
          <button
            onClick={() => navigate('/chat')}
            className="group relative inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95"
          >
            Get Started
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full pb-20">
        <FeatureCard
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
          title="Syllabus-Aligned"
          description="Responses are grounded in your uploaded course materials and syllabus documents."
        />
        <FeatureCard
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
          title="No Hallucinations"
          description="Every answer includes source references and transparent limitation statements."
        />
        <FeatureCard
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
          title="Adaptive Learning"
          description="Choose your explanation mode and difficulty level for personalized responses."
        />
      </div>

    </div>
  );
}
