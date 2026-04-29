import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { ArrowDown, ArrowUp, ArrowUpDown, GripVertical } from 'lucide-react';

export default function IntentGrid({ mode, data }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [columnWidths, setColumnWidths] = useState({});
  const gridRef = useRef(null);

  const initialColumns = [
    { key: 'company', label: 'Company' },
    { key: 'contact', label: 'Contact' },
    { key: 'score', label: 'Lead Score' },
    { key: 'lastContacted', label: 'Last Contacted' },
    { key: 'value', label: 'Deal Value' },
    { key: 'legal', label: 'Legal Status' }
  ];

  const [columns, setColumns] = useState(initialColumns);

  const getColWidth = (key) => {
    if (columnWidths[key]) return columnWidths[key];

    if (mode === 'Research') {
      if (key === 'company' || key === 'contact') return '2fr';
      if (key === 'score' || key === 'lastContacted') return '1fr';
      return '0.5fr'; 
    } else if (mode === 'Closing') {
      if (key === 'value' || key === 'legal') return '2fr';
      if (key === 'score' || key === 'lastContacted') return '1fr';
      return '0.5fr'; 
    } else {
      if (key === 'company' || key === 'contact') return '1.5fr';
      return '1fr';
    }
  };

  const dynamicGridTemplate = columns.map(col => getColWidth(col.key)).join(' ');

  const getCellClasses = (colName) => {
    let base = "p-4 text-sm truncate flex items-center border-b border-slate-100 transition-colors duration-300 ";
    
    if (mode === 'Research') {
      if (colName === 'company' || colName === 'contact') base += "text-slate-900 font-semibold ";
      else base += "text-slate-400 ";
    } else if (mode === 'Closing') {
      if (colName === 'value' || colName === 'legal') base += "text-indigo-700 font-semibold bg-indigo-50/50 ";
      else base += "text-slate-400 ";
    } else {
      base += "text-slate-600 ";
    }
    
    return base;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleResize = (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const headerElement = e.target.parentElement;
    const startWidth = headerElement.offsetWidth;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(80, startWidth + deltaX);
      setColumnWidths(prev => ({
        ...prev,
        [key]: `${newWidth}px`
      }));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const renderCellContent = (colKey, row) => {
    switch (colKey) {
      case 'company': return row.company;
      case 'contact': return row.contact;
      case 'score': return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.score >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {row.score}
        </span>
      );
      case 'lastContacted': return row.lastContacted;
      case 'value': return formatCurrency(row.value);
      case 'legal': return (
        <span className={`px-2 py-1 border rounded text-xs font-medium ${row.legal === 'Approved' ? 'border-green-200 bg-green-50 text-green-700' : row.legal === 'Pending' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
          {row.legal}
        </span>
      );
      default: return null;
    }
  };

  return (
    <div ref={gridRef} className="w-full border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Table Header */}
      <Reorder.Group 
        axis="x"
        values={columns}
        onReorder={setColumns}
        className="grid bg-slate-50 border-b border-slate-200"
        style={{ gridTemplateColumns: dynamicGridTemplate }}
        as="div"
      >
        {columns.map((col) => (
          <Reorder.Item 
            key={col.key} 
            value={col}
            as="div"
            className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between cursor-grab active:cursor-grabbing select-none group hover:text-slate-700 hover:bg-slate-100/50 transition-colors bg-slate-50 relative z-10"
          >
            <div className="flex items-center cursor-pointer flex-grow h-full" onClick={() => handleSort(col.key)}>
              {col.label}
              <span className="ml-1 text-slate-400 flex items-center">
                {sortConfig.key === col.key ? (
                  sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                ) : (
                  <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              {/* Resizer Handle */}
              <div 
                className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-indigo-400/50 transition-colors z-20"
                onMouseDown={(e) => handleResize(e, col.key)}
              />
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Table Body */}
      <div>
        <AnimatePresence>
          {sortedData.map((row) => (
            <motion.div
              layout
              key={row.id}
              className="grid hover:bg-slate-50 transition-colors group cursor-pointer"
              style={{ gridTemplateColumns: dynamicGridTemplate }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {columns.map(col => (
                <motion.div layout key={col.key} className={getCellClasses(col.key)}>
                  {renderCellContent(col.key, row)}
                </motion.div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
