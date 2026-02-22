export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass-card glass-hover p-8 flex flex-col items-start gap-4 transition-all duration-500 group">
      <div className="w-12 h-12 rounded-xl bg-background/50 border border-card-border flex items-center justify-center text-muted group-hover:text-purple-400 group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-all duration-300">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {icon}
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-bold text-foreground mb-2 tracking-tight group-hover:text-purple-300 transition-colors">
          {title}
        </h3>
        <p className="text-muted text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
