export default function MessageBubble({ message }) {
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-4 mb-8 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      
      {/* Icon */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transition-transform duration-300 hover:rotate-12 ${
        isUser 
          ? 'bg-purple-600 border border-purple-400/30' 
          : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
      }`}>
        {isUser ? (
          <span className="text-white text-xs font-bold uppercase">U</span>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-2 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`glass-card px-6 py-5 ${
          isUser 
            ? 'rounded-2xl rounded-tr-sm bg-purple-600/10 border-purple-500/20' 
            : 'rounded-2xl rounded-tl-sm'
        }`}>
          
          {/* Main Content */}
          <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>

          {/* Metadata for AI/System */}
          {(isAssistant || isSystem) && (
            <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
              {message.source && (
                <div>
                  <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Source Context</p>
                  <p className="text-slate-400 text-xs italic">{message.source}</p>
                </div>
              )}
              {message.limitation && (
                <p className="text-[10px] text-slate-500 italic mt-2">
                  {message.limitation}
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Name Label */}
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-1">
          {message.role === 'user' ? 'You' : (isSystem ? 'MindForge System' : 'Assistant')}
        </span>
      </div>

    </div>
  );
}
