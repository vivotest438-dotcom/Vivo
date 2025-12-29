
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { encodeAudio, decodeAudio, decodeAudioData } from '../services/geminiService';
import { MicrophoneIcon, StopCircleIcon, SignalIcon } from '@heroicons/react/24/solid';

const Oracle: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [status, setStatus] = useState('Standby');
  const [transcript, setTranscript] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close?.();
      sessionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setIsLive(false);
    setStatus('Standby');
  }, []);

  const startSession = async () => {
    try {
      setStatus('Connecting...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      if (!outAudioContextRef.current) outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsLive(true);
            setStatus('Listening');
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const processor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const base64 = encodeAudio(new Uint8Array(int16.buffer));
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            
            source.connect(processor);
            processor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.inputTranscription) {
              const text = msg.serverContent.inputTranscription.text;
              if (text) setTranscript(prev => [...prev, `You: ${text}`]);
            }
            if (msg.serverContent?.outputTranscription) {
              const text = msg.serverContent.outputTranscription.text;
               if (text) setTranscript(prev => [...prev, `Lumina: ${text}`]);
            }

            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const ctx = outAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decodeAudio(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Live Error", e);
            stopSession();
          },
          onclose: () => stopSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are Lumina Oracle, a friendly and empathetic conversational AI. Speak naturally and helpfuly.'
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Permission Denied');
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Lumina Oracle</h1>
        <p className="text-slate-400">Low-latency voice interaction. Talk to the AI as if it's right there.</p>
      </div>

      <div className="flex-1 glass rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Pulsing Visualizer (Simplified) */}
        <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-700 ${
          isLive ? 'bg-blue-600/20 scale-110 shadow-[0_0_80px_rgba(37,99,235,0.4)]' : 'bg-slate-800'
        }`}>
          <div className={`w-32 h-32 rounded-full flex items-center justify-center border-2 ${
            isLive ? 'border-blue-400 animate-ping' : 'border-slate-700'
          }`}>
            <MicrophoneIcon className={`w-16 h-16 ${isLive ? 'text-blue-400' : 'text-slate-600'}`} />
          </div>
        </div>

        <div className="mt-12 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
            <span className="font-semibold text-xl">{status}</span>
          </div>
          
          <button
            onClick={isLive ? stopSession : startSession}
            className={`px-8 py-3 rounded-2xl font-bold text-lg transition-all shadow-xl ${
              isLive 
              ? 'bg-red-600 hover:bg-red-500 text-white' 
              : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isLive ? 'Terminate Session' : 'Wake Oracle'}
          </button>
        </div>

        {/* Live Transcript View */}
        <div className="absolute bottom-6 left-6 right-6 h-32 overflow-y-auto glass p-4 rounded-xl border-slate-700/50">
          <p className="text-[10px] uppercase text-slate-500 mb-2 font-bold tracking-widest flex items-center gap-1">
            <SignalIcon className="w-3 h-3" /> Live Protocol
          </p>
          <div className="space-y-1">
            {transcript.map((t, i) => (
              <p key={i} className="text-sm text-slate-300">{t}</p>
            ))}
            {transcript.length === 0 && <p className="text-sm text-slate-600 italic">Waiting for connection...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Oracle;
