import React, { useState } from 'react';
import { AuthCard } from '../../components/complex/AuthCard';
import { Badge } from '../../components/ui/Badge';
import { Shield, Sparkles, Terminal } from 'lucide-react';

export const AuthCardShowcase: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([
    'AuthCard initialized in collapsed magnetic trigger state.',
  ]);

  const addLog = (msg: string) => {
    setLogs((prev) => [ `[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)]);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
        <div>
          <h3 className="font-outfit text-lg font-bold text-white">
            Morphing Auth Card (`AuthCard.tsx`)
          </h3>
          <p className="text-xs text-zinc-400">
            Magnetic glowing button smoothly morphs into an animated Login / Signup glassmorphic form.
          </p>
        </div>
        <Badge variant="purple">Framer Motion Layout ID</Badge>
      </div>

      {/* Main Preview */}
      <div className="min-h-[440px] bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden bg-grid-pattern">
        <AuthCard
          brandName="Apex Cloud Systems"
          onLoginSuccess={(data) => addLog(`SUCCESS: Logged in user ${data.email}`)}
          onRegisterSuccess={(data) => addLog(`SUCCESS: Registered new account for ${data.name} (${data.email})`)}
        />
      </div>

      {/* Live Event Log Output */}
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>Authentication Event Bus Log:</span>
        </div>
        <div className="font-mono text-[11px] space-y-1 text-emerald-400">
          {logs.map((log, i) => (
            <div key={i} className="opacity-90">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
