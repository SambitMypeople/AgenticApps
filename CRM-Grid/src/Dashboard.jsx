import React, { useState, useEffect } from 'react';
import CommandBar from './CommandBar';
import IntentGrid from './IntentGrid';
import MopiChatPanel from './MopiChatPanel';
import { RefreshCw, Cpu, ChevronDown, Download, FileSpreadsheet, FileBarChart, Bot } from 'lucide-react';
import * as XLSX from 'xlsx';
import { initialData } from './data';

export default function Dashboard() {
  const [mode, setMode] = useState('Default');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [data, setData] = useState(initialData);

  // Setup CMD+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const modes = ['Default', 'Research', 'Closing'];
        const nextMode = modes[(modes.indexOf(mode) + 1) % modes.length];
        setMode(nextMode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  const exportToCSV = () => {
    const headers = ['Company', 'Contact', 'Lead Score', 'Last Contacted', 'Deal Value', 'Legal Status'];
    const csvRows = data.map(row => 
      [row.company, row.contact, row.score, row.lastContacted, row.value, row.legal].join(',')
    );
    const csvString = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Export_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setIsExportOpen(false);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(row => ({
      Company: row.company,
      Contact: row.contact,
      'Lead Score': row.score,
      'Last Contacted': row.lastContacted,
      'Deal Value': row.value,
      'Legal Status': row.legal
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, `Export_${new Date().getTime()}.xlsx`);
    setIsExportOpen(false);
  };

  const openCustomReport = () => {
    setIsExportOpen(false);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans selection:bg-indigo-500/30">
      <MopiChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} gridData={data} />
      
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Intent-Aware CRM</h1>
            <p className="text-slate-500">Fluid workspace that adapts to your current task.</p>
          </div>
          
          {mode !== 'Default' && (
            <button 
              onClick={() => setMode('Default')}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              Reset to Intent
            </button>
          )}
        </header>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start">
          <div className="flex-grow w-full max-w-2xl">
            <CommandBar mode={mode} setMode={setMode} />
          </div>
          
          {/* Export Button Dropdown */}
          <div className="relative mt-1">
            <button 
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-2 px-6 py-3 bg-[#16a34a] border border-[#16a34a] rounded-xl text-base font-bold text-white hover:bg-[#15803d] transition-colors shadow-md"
            >
              <Cpu className="w-5 h-5 text-white" />
              Export
              <ChevronDown className="w-5 h-5 text-green-200 ml-1" />
            </button>
            
            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-10 py-2 overflow-hidden">
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                  onClick={exportToCSV}
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  Export to CSV
                </button>
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                  onClick={exportToExcel}
                >
                  <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                  Export to Excel
                </button>
                <div className="h-px bg-slate-100 my-1 w-full" />
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-green-700 hover:bg-green-50 transition-colors font-semibold"
                  onClick={openCustomReport}
                >
                  <Bot className="w-4 h-4 text-green-600" />
                  Customised Report
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <IntentGrid mode={mode} data={data} />
        </div>
      </div>
    </div>
  );
}
