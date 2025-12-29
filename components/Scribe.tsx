
import React, { useState } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { PencilIcon, DocumentDuplicateIcon, ClipboardDocumentIcon } from '@heroicons/react/24/solid';

const Scribe: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'creative' | 'summary' | 'business'>('creative');

  const handleWrite = async () => {
    if (!prompt) return;
    setIsLoading(true);
    const systemInstructions = {
      creative: "You are a world-class creative writer. Craft evocative, descriptive, and engaging narratives.",
      summary: "You are an expert editor. Provide concise, punchy summaries that capture the core essence of the input.",
      business: "You are a professional corporate strategist. Write clear, formal, and persuasive business communications."
    };

    try {
      const response = await getGeminiResponse(prompt, 'gemini-3-flash-preview', systemInstructions[mode]);
      setResult(response);
    } catch (err) {
      console.error(err);
      alert("Scribe encountered a block. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    alert("Copied to clipboard!");
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Scribe Workshop</h1>
        <p className="text-slate-400">Refine your prose, summarize documents, or generate professional drafts.</p>
      </div>

      <div className="flex gap-4">
        {(['creative', 'summary', 'business'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-6 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
              mode === m ? 'bg-blue-600 text-white' : 'glass text-slate-400 hover:text-slate-200'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-2xl flex flex-col overflow-hidden h-[500px]">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Input Draft</span>
            <PencilIcon className="w-4 h-4 text-slate-500" />
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Enter your ${mode} prompt here...`}
            className="flex-1 bg-transparent p-6 outline-none resize-none text-slate-200 leading-relaxed"
          />
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleWrite}
              disabled={isLoading || !prompt}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Execute Drafting'
              )}
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl flex flex-col overflow-hidden h-[500px] border-blue-500/20">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Output Content</span>
            <button 
              onClick={copyToClipboard}
              disabled={!result}
              className="hover:text-blue-400 transition-colors disabled:opacity-30"
            >
              <ClipboardDocumentIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 p-6 overflow-y-auto whitespace-pre-wrap leading-relaxed prose prose-invert max-w-none">
            {result || <span className="text-slate-700 italic">Generated content will appear here...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scribe;
