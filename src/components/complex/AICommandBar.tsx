import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  Command,
  ArrowRight,
  PlusCircle,
  Package,
  FileSpreadsheet,
  TrendingUp,
  Sliders,
  CornerDownLeft,
  X,
  Bot,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export interface CommandItem {
  id: string;
  title: string;
  category: 'Actions' | 'Inventory' | 'Analytics' | 'System';
  icon: React.ReactNode;
  shortcut?: string;
  description?: string;
}

export interface AICommandBarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onExecuteCommand?: (command: CommandItem) => void;
  onPromptSubmit?: (prompt: string) => void;
  placeholder?: string;
  className?: string;
}

const DEFAULT_COMMANDS: CommandItem[] = [
  {
    id: 'restock-low-stock',
    title: 'Restock Low-Stock Products',
    category: 'Inventory',
    icon: <Package className="w-4 h-4 text-amber-400" />,
    shortcut: '⌘ R',
    description: 'Auto-generate purchase order for items below threshold',
  },
  {
    id: 'add-product',
    title: 'Create New Inventory SKU',
    category: 'Actions',
    icon: <PlusCircle className="w-4 h-4 text-emerald-400" />,
    shortcut: '⌘ N',
    description: 'Open product creation wizard',
  },
  {
    id: 'export-sales',
    title: 'Generate Weekly Sales Analysis',
    category: 'Analytics',
    icon: <TrendingUp className="w-4 h-4 text-indigo-400" />,
    shortcut: '⌘ E',
    description: 'Compile revenue, margins, and top items',
  },
  {
    id: 'export-csv',
    title: 'Export Inventory CSV',
    category: 'Actions',
    icon: <FileSpreadsheet className="w-4 h-4 text-sky-400" />,
    description: 'Download full table data as spreadsheet',
  },
  {
    id: 'system-config',
    title: 'Configure POS Terminal',
    category: 'System',
    icon: <Sliders className="w-4 h-4 text-purple-400" />,
    shortcut: '⌘ ,',
    description: 'Adjust receipt printers, tax rates, and offline storage',
  },
];

const SUGGESTIONS = [
  'Restock low-stock products',
  'Generate sales forecast for Q3',
  'Audit SKU discounts',
  'Find top 5 revenue items',
];

export const AICommandBar: React.FC<AICommandBarProps> = ({
  isOpen: controlledIsOpen,
  onClose,
  onExecuteCommand,
  onPromptSubmit,
  placeholder = 'Ask AI or type a command...',
  className,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? internalIsOpen;

  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Listener for Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (onClose && isOpen) {
          onClose();
        } else {
          setInternalIsOpen((prev) => !prev);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        if (onClose) onClose();
        else setInternalIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setAiResponse(null);
      setIsThinking(false);
    }
  }, [isOpen]);

  const filteredCommands = DEFAULT_COMMANDS.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase()) ||
      (cmd.description && cmd.description.toLowerCase().includes(query.toLowerCase()))
  );

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands.length > 0 && selectedIndex < filteredCommands.length) {
        handleExecute(filteredCommands[selectedIndex]);
      } else if (query.trim()) {
        handlePromptSubmit(query);
      }
    }
  };

  const handleExecute = (command: CommandItem) => {
    onExecuteCommand?.(command);
    if (onClose) onClose();
    else setInternalIsOpen(false);
  };

  const handlePromptSubmit = (promptText: string) => {
    setQuery(promptText);
    setIsThinking(true);
    setAiResponse(null);

    setTimeout(() => {
      setIsThinking(false);
      setAiResponse(`AI Suggestion for "${promptText}": Scanned 42 items. Recommended 12 units restocked to maintain 98% fulfillment SLA.`);
      onPromptSubmit?.(promptText);
    }, 1200);
  };

  const handleClose = () => {
    if (onClose) onClose();
    else setInternalIsOpen(false);
  };

  return (
    <>
      {/* Floating Trigger Button (Always available if modal is closed) */}
      {!isOpen && (
        <motion.button
          type="button"
          onClick={() => setInternalIsOpen(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="fixed bottom-6 right-6 px-4 py-2.5 bg-zinc-900/90 border border-zinc-700/80 rounded-2xl text-xs font-medium text-zinc-200 shadow-2xl flex items-center gap-3 backdrop-blur-xl hover:border-indigo-500/50 hover:bg-zinc-800 transition-all z-40 group"
        >
          <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>AI Command Bar</span>
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400 group-hover:text-white">
            Ctrl + K
          </kbd>
        </motion.button>
      )}

      {/* Modal Dialog Backdrop & Command Palette */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Floating Palette Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={cn(
                'relative w-full max-w-2xl bg-zinc-950/95 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl text-zinc-100 z-10',
                className
              )}
            >
              {/* Input Header */}
              <div className="relative flex items-center px-4 py-3.5 border-b border-zinc-800/80">
                <div
                  className={cn(
                    'p-2 rounded-xl transition-all mr-3',
                    isThinking
                      ? 'bg-indigo-500/20 text-indigo-400 animate-pulse'
                      : 'bg-zinc-900 text-zinc-400'
                  )}
                >
                  {isThinking ? <Sparkles className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDownInInput}
                  placeholder={placeholder}
                  className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setAiResponse(null);
                    }}
                    className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors mr-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleClose}
                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-[10px] text-zinc-400 hover:text-white rounded-lg border border-zinc-800 font-mono transition-colors"
                >
                  ESC
                </button>
              </div>

              {/* Suggestion Chips */}
              <div className="px-4 py-2 bg-zinc-900/40 border-b border-zinc-800/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider shrink-0">
                  Try Asking:
                </span>
                {SUGGESTIONS.map((text) => (
                  <button
                    key={text}
                    type="button"
                    onClick={() => handlePromptSubmit(text)}
                    className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-[11px] text-zinc-300 hover:text-indigo-400 shrink-0 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    {text}
                  </button>
                ))}
              </div>

              {/* AI Response Card (if present) */}
              <AnimatePresence>
                {aiResponse && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-indigo-950/40 border-b border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-3"
                  >
                    <Bot className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="font-semibold text-indigo-300 flex items-center justify-between">
                        <span>AI Assistant Recommendation</span>
                        <Badge variant="purple" size="sm">
                          Automated Analysis
                        </Badge>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{aiResponse}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Filtered Command List */}
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {filteredCommands.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <p className="text-xs text-zinc-400">No pre-built command found for "{query}".</p>
                    <button
                      type="button"
                      onClick={() => handlePromptSubmit(query)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      Ask AI Agent to execute "{query}"
                    </button>
                  </div>
                ) : (
                  filteredCommands.map((cmd, idx) => (
                    <button
                      key={cmd.id}
                      type="button"
                      onClick={() => handleExecute(cmd)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        'w-full flex items-center justify-between p-3 rounded-xl text-left transition-all group',
                        idx === selectedIndex
                          ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                          : 'hover:bg-zinc-900/80 text-zinc-300 border border-transparent'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'p-2 rounded-lg transition-colors',
                            idx === selectedIndex ? 'bg-indigo-600/30' : 'bg-zinc-900'
                          )}
                        >
                          {cmd.icon}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white flex items-center gap-2">
                            <span>{cmd.title}</span>
                            <Badge variant="neutral" size="sm">
                              {cmd.category}
                            </Badge>
                          </div>
                          {cmd.description && (
                            <p className="text-[11px] text-zinc-400 mt-0.5">{cmd.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {cmd.shortcut && (
                          <kbd className="px-2 py-1 text-[10px] font-mono bg-zinc-900 border border-zinc-800 rounded-md text-zinc-400">
                            {cmd.shortcut}
                          </kbd>
                        )}
                        <CornerDownLeft className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Footer Guide */}
              <div className="px-4 py-2.5 bg-zinc-900/80 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300 font-mono">↑↓</kbd>{' '}
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300 font-mono">↵</kbd> Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300 font-mono">ESC</kbd> Close
                  </span>
                </div>
                <div className="flex items-center gap-1 text-indigo-400 font-medium">
                  <Command className="w-3.5 h-3.5" />
                  <span>Apex AI Core v2.4</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
