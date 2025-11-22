import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';

interface CommandInputProps {
  onSubmit: (cmd: string) => void;
  disabled: boolean;
}

export const CommandInput: React.FC<CommandInputProps> = ({ onSubmit, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight for shrinkage
      textareaRef.current.style.height = 'auto';
      // Set new height based on scrollHeight, capped at 200px
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        onSubmit(input);
        setInput('');
        // Reset height immediately after submit
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
      }
    }
  };

  const suggestions = [
    "Fire at Galaxy Apartments, Mumbai. 5th floor, 10 people trapped.",
    "Medical emergency in Bangalore, traffic blocked near Indiranagar.",
    "Flood water entering houses in Chennai, need evacuation boat.",
  ];

  return (
    <div className="p-4 bg-black border-t border-gray-800 shrink-0">
      {/* Suggestions Row */}
      <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => setInput(s)}
            className="whitespace-nowrap px-3 py-1.5 text-xs border border-gray-700 bg-gray-900/50 rounded-full text-gray-400 hover:border-hud-blue hover:text-hud-blue transition-colors"
          >
            {s.substring(0, 35)}...
          </button>
        ))}
      </div>

      <div className="relative flex items-end bg-gray-900 border border-gray-700 rounded-lg focus-within:border-hud-blue focus-within:ring-1 focus-within:ring-hud-blue transition-all">
        <span className="absolute left-4 top-3 text-hud-blue font-mono font-bold select-none pt-1">{'>'}</span>
        
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          className="w-full bg-transparent border-none py-4 pl-10 pr-24 font-mono text-sm text-white focus:ring-0 resize-none overflow-y-auto max-h-[200px] scrollbar-hide placeholder-gray-600 leading-relaxed"
          placeholder="Describe the emergency... (Shift+Enter for new line)"
          autoFocus
        />

        <button 
            onClick={() => { if(input.trim()) { onSubmit(input); setInput(''); }}}
            disabled={disabled || !input.trim()}
            className="absolute right-2 bottom-2 bg-hud-blue text-black text-xs font-bold px-4 py-1.5 rounded hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all h-8"
        >
            SEND
        </button>
      </div>
    </div>
  );
};