import { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import { askQuestion, getFiles } from '../services/api';

const INITIAL_MESSAGE = {
  role: 'system',
  content: "Welcome to MindForge! I'm your AI learning assistant. Ask me anything related to your uploaded course materials. I'll provide answers grounded in your syllabus with source references.",
  source: 'MindForge DB',
  limitation: "Responses are limited to indexed materials. For topics outside your syllabus, I'll provide a disclaimer.",
};

export default function Chat() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Context State
  const [mode, setMode] = useState('Step-by-Step');
  const [level, setLevel] = useState('Intermediate');
  const [language, setLanguage] = useState('English');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getFiles();
        setUploadedFiles(data.files || []);
      } catch (err) {
        console.error('Failed to fetch files:', err);
      }
    };
    fetchFiles();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    const q = input.trim();
    if (!q || loading) return;

    setInput('');
    setError('');
    setMessages((prev) => [...prev, { role: 'user', content: q }]);
    setLoading(true);

    try {
      const data = await askQuestion(q, mode, level, language);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer,
          source: data.source,
          limitation: data.limitation,
        },
      ]);
    } catch (err) {
      setError(err.friendlyMessage || 'Connection error. Please ensure the backend is running.');
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen pt-16 relative overflow-hidden">
      <div className="background-aurora" />

      {/* Sidebar */}
      <div className="relative z-10 h-full">
        <Sidebar
          mode={mode} setMode={setMode}
          level={level} setLevel={setLevel}
          language={language} setLanguage={setLanguage}
          uploadedFiles={uploadedFiles}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {loading && <TypingIndicator />}
            {error && (
              <div className="mb-6 glass-card bg-red-500/10 border-red-500/20 px-6 py-4 flex items-center gap-3 animate-float">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-red-400 font-medium">{error}</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Dock */}
        <div className="p-6 border-t border-white/5"
          style={{ background: 'rgba(11,15,26,0.5)', backdropFilter: 'blur(32px)' }}>
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
              <div className="relative glass-card bg-background/50 border-card-border flex items-center gap-3 px-6 py-4 focus-within:border-purple-500/40 transition-all">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your doubt here..."
                  disabled={loading}
                  className="flex-1 bg-transparent text-foreground text-sm placeholder-muted focus:outline-none disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:scale-110 active:scale-95 flex-shrink-0"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] font-bold text-muted uppercase tracking-widest mt-4">
              Answers are grounded in indexed syllabus materials. Safe & Accurate.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
