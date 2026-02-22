import { useState, useEffect } from 'react';

export default function MessageBubble({ message }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';
  const isUser = message.role === 'user';

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

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
        <div className={`glass-card px-6 py-5 relative group/bubble ${
          isUser 
            ? 'rounded-2xl rounded-tr-sm bg-purple-600/10 border-purple-500/20' 
            : 'rounded-2xl rounded-tl-sm'
        }`}>
          
          {/* TTS Button (Assistant only) */}
          {isAssistant && isSpeechSupported && (
            <button
              onClick={() => speakText(message.content)}
              className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 z-20 
                ${isSpeaking 
                  ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse' 
                  : 'bg-background/20 text-muted hover:bg-white/10 hover:text-foreground opacity-0 group-hover/bubble:opacity-100'
                }`}
              title={isSpeaking ? "Stop Speaking" : "Speak Out"}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isSpeaking ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                )}
              </svg>
            </button>
          )}

          {/* Main Content */}
          {isAssistant && (message.content.includes('+--') || message.content.includes('|') || message.content.includes('\\') || message.content.includes('/')) ? (
            <pre className="font-mono whitespace-pre-wrap text-sm leading-relaxed text-foreground bg-background p-4 rounded-lg border border-card-border overflow-x-auto custom-scrollbar">
              {message.content}
            </pre>
          ) : (
            <div className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
          )}

          {/* Metadata for AI/System */}
          {(isAssistant || isSystem) && (
            <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
              {message.source && (
                <div>
                  <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Source Context</p>
                  <p className="text-muted text-xs italic">{message.source}</p>
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
