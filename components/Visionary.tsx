
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { SparklesIcon, PhotoIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

const Visionary: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<{ url: string; prompt: string }[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const url = await generateImage(prompt);
      setResults(prev => [{ url, prompt }, ...prev]);
    } catch (err) {
      console.error(err);
      alert("Error generating image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Visionary Studio</h1>
        <p className="text-slate-400">Bring your wildest imaginations to life with state-of-the-art image synthesis.</p>
      </div>

      <div className="glass p-6 rounded-2xl space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your masterpiece... e.g., 'A bioluminescent forest at night with floating crystalline structures'"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 pr-32 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-32"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <SparklesIcon className="w-5 h-5" />
            )}
            Generate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isGenerating && (
          <div className="aspect-square rounded-2xl glass flex flex-col items-center justify-center p-8 text-center animate-pulse border-blue-500/30 border">
            <PhotoIcon className="w-12 h-12 text-blue-400/50 mb-4" />
            <p className="text-sm text-slate-400">Synthesizing pixels from noise...</p>
          </div>
        )}

        {results.map((res, idx) => (
          <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden glass hover:ring-2 ring-blue-500 transition-all">
            <img src={res.url} alt={res.prompt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
              <p className="text-xs text-slate-300 line-clamp-2 mb-3">{res.prompt}</p>
              <div className="flex gap-2">
                <a 
                  href={res.url} 
                  download="lumina-generation.png"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        ))}

        {results.length === 0 && !isGenerating && (
          <div className="col-span-full py-20 text-center">
            <PhotoIcon className="w-16 h-16 text-slate-800 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-600">No masterpieces yet</h3>
            <p className="text-slate-700">Enter a prompt above to start creating.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Visionary;
