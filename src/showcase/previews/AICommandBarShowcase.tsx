import React, { useState } from 'react';
import { AICommandBar, CommandItem } from '../../components/complex/AICommandBar';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Sparkles, Command, CheckCircle2 } from 'lucide-react';

export const AICommandBarShowcase: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastExecuted, setLastExecuted] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
        <div>
          <h3 className="font-outfit text-lg font-bold text-white">
            AI Command & Prompt Bar (`AICommandBar.tsx`)
          </h3>
          <p className="text-xs text-zinc-400">
            Raycast / ChatGPT style floating command palette with keyboard shortcut (`Ctrl + K` or `Cmd + K`), pulse glow, and prompt suggestion chips.
          </p>
        </div>
        <Badge variant="accent">Global Shortcut Listener (Ctrl+K)</Badge>
      </div>

      {/* Main Preview */}
      <div className="p-10 bg-zinc-950/80 border border-zinc-800/80 rounded-3xl flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden bg-grid-pattern">
        <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-2xl">
          <Command className="w-8 h-8 animate-pulse" />
        </div>

        <div className="max-w-md space-y-2">
          <h4 className="text-xl font-bold text-white font-outfit">Test AI Command Palette</h4>
          <p className="text-xs text-zinc-400">
            Press <kbd className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded font-mono text-zinc-200">Ctrl + K</kbd> or click the button below to trigger the prompt palette.
          </p>
        </div>

        <Button
          variant="glow"
          size="lg"
          onClick={() => setIsOpen(true)}
          leftIcon={<Sparkles className="w-5 h-5" />}
        >
          Open AI Command Palette
        </Button>
      </div>

      {/* Execution Results Display */}
      {(lastExecuted || lastPrompt) && (
        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Command Dispatch Output:</span>
          </div>
          {lastExecuted && (
            <p className="text-xs text-zinc-300">
              Executed Command Item:{' '}
              <span className="font-mono text-indigo-400 font-bold">{lastExecuted}</span>
            </p>
          )}
          {lastPrompt && (
            <p className="text-xs text-zinc-300">
              Submitted AI Prompt:{' '}
              <span className="font-mono text-purple-400 font-bold">"{lastPrompt}"</span>
            </p>
          )}
        </div>
      )}

      {/* Render Component */}
      <AICommandBar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onExecuteCommand={(cmd: CommandItem) => {
          setLastExecuted(`${cmd.title} (${cmd.id})`);
        }}
        onPromptSubmit={(prompt: string) => {
          setLastPrompt(prompt);
        }}
      />
    </div>
  );
};
