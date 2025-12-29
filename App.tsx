
import React, { useState, useEffect } from 'react';
import { Logo } from './components/Logo';
import { AppTool } from './types';
import Visionary from './components/Visionary';
import Architect from './components/Architect';
import Oracle from './components/Oracle';
import Scribe from './components/Scribe';
import { 
  SparklesIcon, 
  CpuChipIcon, 
  MicrophoneIcon, 
  PencilSquareIcon,
  HomeIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<AppTool>(AppTool.Visionary);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const tools = [
    { id: AppTool.Visionary, name: 'Visionary', icon: SparklesIcon, desc: 'Image Generation' },
    { id: AppTool.Architect, name: 'Architect', icon: CpuChipIcon, desc: 'Advanced Logic' },
    { id: AppTool.Oracle, name: 'Oracle', icon: MicrophoneIcon, desc: 'Voice Conversation' },
    { id: AppTool.Scribe, name: 'Scribe', icon: PencilSquareIcon, desc: 'Content Creation' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 glass h-full flex flex-col z-20`}>
        <div className="p-6 flex items-center gap-3">
          <Logo className="w-8 h-8 text-blue-400 float" />
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight gradient-text">Lumina</span>}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                activeTool === tool.id 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                : 'hover:bg-slate-800/50 text-slate-400'
              }`}
            >
              <tool.icon className="w-6 h-6 flex-shrink-0" />
              {isSidebarOpen && (
                <div className="text-left">
                  <div className="text-sm font-semibold">{tool.name}</div>
                  <div className="text-[10px] opacity-60 uppercase tracking-widest">{tool.desc}</div>
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Squares2X2Icon className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 glass border-b border-slate-800 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Modules</span>
            <span className="text-slate-700">/</span>
            <span className="font-medium text-slate-200">{tools.find(t => t.id === activeTool)?.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-medium">
              Gemini 3 Connected
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
              <img src="https://picsum.photos/32/32" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#0b1120]">
          <div className="max-w-6xl mx-auto h-full">
            {activeTool === AppTool.Visionary && <Visionary />}
            {activeTool === AppTool.Architect && <Architect />}
            {activeTool === AppTool.Oracle && <Oracle />}
            {activeTool === AppTool.Scribe && <Scribe />}
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      </main>
    </div>
  );
};

export default App;
