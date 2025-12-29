
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { PaperAirplaneIcon, CommandLineIcon, UserCircleIcon } from '@heroicons/react/24/solid';

const Architect: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(userMsg, 'gemini-3-pro-preview', 'You are Lumina Architect, an advanced problem-solving AI focused on clear, analytical reasoning and high-quality code. Format responses in beautiful Markdown.');
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', content: 'Forgive me, an architectural failure occurred. Please retry.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Architect Engine</h1>
          <p className="text-slate-400">Deep reasoning and complex logic powered by Gemini 3 Pro.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setMessages([])}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200"
          >
            Clear Thread
          </button>
        </div>
      </div>

      <div className="flex-1 glass rounded-2xl flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <CommandLineIcon className="w-16 h-16 mb-4" />
              <p className="max-w-xs">Ask a complex question, request code implementation, or start a logic puzzle.</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'ai' && <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0"><CommandLineIcon className="w-5 h-5" /></div>}
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
              {msg.role === 'user' && <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0"><UserCircleIcon className="w-5 h-5" /></div>}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center animate-pulse"><CommandLineIcon className="w-5 h-5" /></div>
              <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 w-24 flex gap-1 items-center justify-center">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query the Architect..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg"
            >
              <PaperAirplaneIcon className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Architect;
