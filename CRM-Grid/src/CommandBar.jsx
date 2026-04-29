import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function CommandBar({ mode, setMode }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const val = input.toLowerCase();
      if (val.includes('research')) {
        setMode('Research');
        setInput('');
      } else if (val.includes('close') || val.includes('closing')) {
        setMode('Closing');
        setInput('');
      } else if (val.includes('default')) {
        setMode('Default');
        setInput('');
      }
    }
  };

  return (
    <div className="w-full">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3 pl-12 pr-24 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400 shadow-sm"
          placeholder="Type 'Research' or 'Close' to change layout..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <span className="bg-slate-100 text-slate-500 text-xs px-2 rounded border border-slate-200 font-medium leading-none flex items-center h-6">
            CMD+K
          </span>
        </div>
      </div>
      <div className="mt-2 text-sm text-slate-500">
        Current Mode: <span className="text-indigo-600 font-medium">{mode}</span>
      </div>
    </div>
  );
}
