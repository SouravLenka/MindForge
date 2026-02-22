import { useState } from 'react';
import { uploadPDF } from '../services/api';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [sessionFiles, setSessionFiles] = useState([]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setMessage({ text: '', type: '' });
    } else {
      setMessage({ text: 'Please select a valid PDF file.', type: 'error' });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setMessage({ text: 'Indexing your document... This may take a moment.', type: 'info' });

    try {
      const data = await uploadPDF(file);
      setMessage({ text: data.message || 'File uploaded and indexed successfully!', type: 'success' });
      setSessionFiles((prev) => [file.name, ...prev]);
      setFile(null);
    } catch (err) {
      setMessage({
        text: err.friendlyMessage || 'Upload failed. Please check your connection.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 relative overflow-hidden flex flex-col items-center">
      <div className="background-aurora" />

      {/* Header */}
      <div className="relative z-10 text-center mb-12">
        <h2 className="text-4xl font-extrabold text-foreground mb-3 tracking-tight">Index Materials</h2>
        <p className="text-muted max-w-md mx-auto">
          Upload your syllabus or course material in PDF format to enable context-aware doubt resolution.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-2xl grid grid-cols-1 gap-8">
        
        {/* Upload Card */}
        <div className="glass-card p-10 flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-2xl bg-background/50 border-2 border-dashed flex items-center justify-center mb-6 transition-all duration-500 ${
            file ? 'border-purple-500/50 bg-purple-500/5 rotate-3' : 'border-card-border group-hover:border-purple-500/20'
          }`}>
            <svg className={`w-10 h-10 transition-colors ${file ? 'text-purple-400' : 'text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <label className="cursor-pointer group">
            <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} disabled={loading} />
            <span className="bg-background/50 border border-card-border group-hover:bg-white/10 group-hover:border-purple-500/20 text-foreground px-8 py-3 rounded-full font-bold text-sm transition-all shadow-xl">
              {file ? 'Change Selection' : 'Choose PDF File'}
            </span>
          </label>

          {file && (
            <div className="mt-6 flex flex-col items-center">
              <p className="text-sm text-purple-300 font-medium mb-6">
                Ready to index: <span className="text-white underline">{file.name}</span>
              </p>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-full font-extrabold text-sm transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] disabled:opacity-50 flex items-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Indexing...' : 'Start Indexing'}
              </button>
            </div>
          )}

          {/* Toast / Status Message */}
          {message.text && (
            <div className={`mt-8 px-6 py-3 rounded-xl text-sm font-medium border flex items-center gap-3 animate-aurora ${
              message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
              message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' :
              'bg-blue-500/10 border-blue-500/20 text-blue-300'
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                message.type === 'error' ? 'bg-red-400' : message.type === 'success' ? 'bg-emerald-400' : 'bg-blue-400'
              }`} />
              {message.text}
            </div>
          )}
        </div>

        {/* Index List */}
        <div className="glass-card p-10">
          <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-6 px-1">Indexed in Current Session</h3>
          <div className="space-y-3">
            {sessionFiles.length === 0 ? (
              <p className="text-xs text-slate-600 italic px-1">No files indexed in this session.</p>
            ) : (
              sessionFiles.map((name, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl group hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium truncate">{name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Ready for Doubts</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
