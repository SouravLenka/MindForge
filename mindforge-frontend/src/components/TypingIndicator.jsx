export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(139,92,246,0.5)]">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div className="glass px-4 py-3 rounded-2xl rounded-tl-sm max-w-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-400 typing-indicator-dot"></span>
          <span className="w-2 h-2 rounded-full bg-purple-400 typing-indicator-dot"></span>
          <span className="w-2 h-2 rounded-full bg-purple-400 typing-indicator-dot"></span>
        </div>
      </div>
    </div>
  );
}
