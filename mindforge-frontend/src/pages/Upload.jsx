import { useState } from 'react';
import { uploadPDF, getIndexingStatus } from '../services/api';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isPdfFile = (file) => Boolean(
  file && (file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf'))
);

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [sessionFiles, setSessionFiles] = useState([]);

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    if (isPdfFile(selected)) {
      setFile(selected);
      setMessage({ text: '', type: '' });
    } else {
      setFile(null);
      setMessage({ text: 'Please select a valid PDF file (.pdf).', type: 'error' });
    }
    event.target.value = '';
  };

  const handleUpload = async () => {
    if (!file || loading) return;

    const selectedFile = file;
    setLoading(true);
    setMessage({ text: 'Uploading your PDF...', type: 'info' });

    try {
      const job = await uploadPDF(selectedFile);
      if (!job.job_id) throw new Error('The server did not return an indexing job ID.');

      // Indexing runs as a backend background task, so the upload request can
      // return quickly instead of timing out while the embedding model loads.
      const maxPolls = 600; // 20 minutes at a 2-second interval.
      for (let attempt = 0; attempt < maxPolls; attempt += 1) {
        await sleep(2000);
        const status = await getIndexingStatus(job.job_id);

        if (status.status === 'completed') {
          setMessage({ text: status.message || 'PDF indexed successfully!', type: 'success' });
          setSessionFiles((previous) => [
            selectedFile.name,
            ...previous.filter((name) => name !== selectedFile.name),
          ]);
          setFile(null);
          return;
        }

        if (status.status === 'failed') {
          throw new Error(status.message || 'PDF indexing failed.');
        }

        setMessage({
          text: status.message || 'Your PDF is being indexed. The first run may take a few minutes while the embedding model downloads.',
          type: 'info',
        });
      }

      throw new Error('Indexing is taking longer than expected. Check the backend logs before uploading the file again.');
    } catch (error) {
      setMessage({
        text: error.friendlyMessage || error.message || 'Upload failed. Please check the backend logs.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 relative overflow-hidden flex flex-col items-center">
      <div className="background-aurora" />

      <div className="relative z-10 text-center mb-12">
        <h2 className="text-4xl font-extrabold text-foreground mb-3 tracking-tight">Index Materials</h2>
        <p className="text-muted max-w-md mx-auto">
          Upload your syllabus or course material in PDF format to enable context-aware doubt resolution.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-2xl grid grid-cols-1 gap-8 min-w-0">
        <div className="glass-card p-6 sm:p-10 min-w-0 flex flex-col items-center text-center overflow-hidden">
          <div className={`w-20 h-20 shrink-0 rounded-2xl bg-background/50 border-2 border-dashed flex items-center justify-center mb-6 transition-all duration-500 ${
            file ? 'border-purple-500/50 bg-purple-500/5 rotate-3' : 'border-card-border group-hover:border-purple-500/20'
          }`}>
            <svg className={`w-10 h-10 transition-colors ${file ? 'text-purple-400' : 'text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <label className="cursor-pointer group">
            <input type="file" className="hidden" accept=".pdf,application/pdf" onChange={handleFileChange} disabled={loading} />
            <span className="inline-flex max-w-full bg-background/50 border border-card-border group-hover:bg-white/10 group-hover:border-purple-500/20 text-foreground px-8 py-3 rounded-full font-bold text-sm transition-all shadow-xl">
              {file ? 'Change Selection' : 'Choose PDF File'}
            </span>
          </label>

          {file && (
            <div className="mt-6 w-full min-w-0 flex flex-col items-center">
              <p className="max-w-full min-w-0 text-sm text-purple-300 font-medium mb-6 break-words [overflow-wrap:anywhere]">
                Ready to index: <span className="text-white underline">{file.name}</span>
              </p>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="max-w-full bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-full font-extrabold text-sm transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4 shrink-0 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                )}
                <span className="break-words">{loading ? 'Indexing...' : 'Start Indexing'}</span>
              </button>
            </div>
          )}

          {message.text && (
            <div role={message.type === 'error' ? 'alert' : 'status'} aria-live="polite" className={`mt-8 w-full max-w-full min-w-0 box-border px-4 sm:px-6 py-4 rounded-xl text-sm leading-relaxed font-medium border flex items-start gap-3 text-left whitespace-normal break-words [overflow-wrap:anywhere] ${
              message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
              message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' :
              'bg-blue-500/10 border-blue-500/20 text-blue-300'
            }`}>
              <div className={`mt-1.5 w-2 h-2 shrink-0 rounded-full animate-pulse ${
                message.type === 'error' ? 'bg-red-400' : message.type === 'success' ? 'bg-emerald-400' : 'bg-blue-400'
              }`} />
              <span className="flex-1 min-w-0 whitespace-normal break-words [overflow-wrap:anywhere]">{message.text}</span>
            </div>
          )}
        </div>

        <div className="glass-card p-6 sm:p-10 min-w-0 overflow-hidden">
          <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-6 px-1">Indexed in Current Session</h3>
          <div className="space-y-3 min-w-0">
            {sessionFiles.length === 0 ? (
              <p className="text-xs text-slate-600 italic px-1">No files indexed in this session.</p>
            ) : (
              sessionFiles.map((name, index) => (
                <div key={name + index} className="flex min-w-0 items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl group hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium break-words [overflow-wrap:anywhere]">{name}</p>
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
