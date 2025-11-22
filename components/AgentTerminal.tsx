import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

interface AgentTerminalProps {
  logs: ChatMessage[]; 
  isProcessing: boolean;
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({ logs, isProcessing }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever logs change or processing state changes
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isProcessing]);

  return (
    <div className="flex flex-col h-full bg-black border-l border-gray-800 font-sans min-h-0">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/80 flex justify-between items-center backdrop-blur-sm shrink-0 z-10">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-safe-green rounded-full animate-pulse"></div>
            <span className="text-gray-100 font-bold tracking-wide text-sm">ResQ-AI ASSISTANT</span>
        </div>
        <div className="flex gap-2">
           <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${isProcessing ? 'bg-hud-blue text-black animate-pulse' : 'bg-gray-800 text-gray-500'}`}>
             {isProcessing ? 'PROCESSING...' : 'ONLINE'}
           </span>
        </div>
      </div>

      {/* Chat Feed */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gradient-to-b from-black to-gray-900/20"
      >
        {/* Welcome Message */}
        {logs.length === 0 && (
            <div className="text-center mt-10 opacity-50 px-6">
                <div className="w-12 h-12 bg-gray-800 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <p className="text-sm text-gray-400">Type a message or describe an emergency. <br/> Example: "Fire in Connaught Place, Delhi"</p>
            </div>
        )}

        {logs.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
                className={`
                    max-w-[90%] md:max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-lg whitespace-pre-wrap break-words
                    ${msg.sender === 'user' 
                        ? 'bg-hud-blue text-black rounded-tr-none' 
                        : 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700'}
                `}
            >
                <div className="font-sans">{msg.text}</div>
                <div className={`text-[10px] mt-1.5 opacity-40 font-mono text-right ${msg.sender === 'user' ? 'text-black' : 'text-gray-300'}`}>
                    {msg.timestamp}
                </div>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start animate-fade-in">
             <div className="bg-gray-900/50 border border-gray-800 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
             </div>
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={bottomRef} className="h-1"></div>
      </div>
    </div>
  );
};