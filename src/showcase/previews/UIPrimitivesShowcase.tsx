import React, { useState } from 'react';
import { Button, ButtonVariant, ButtonSize } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge, BadgeVariant, BadgeSize } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Sparkles, Mail, Lock, CheckCircle2, ArrowRight, ShieldCheck, Download, Trash2, Heart } from 'lucide-react';

export const UIPrimitivesShowcase: React.FC = () => {
  // Button State
  const [btnVariant, setBtnVariant] = useState<ButtonVariant>('glow');
  const [btnSize, setBtnSize] = useState<ButtonSize>('md');
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnPulse, setBtnPulse] = useState(false);

  // Input State
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [inputVariant, setInputVariant] = useState<'default' | 'glass' | 'filled'>('glass');

  // Badge State
  const [badgeVariant, setBadgeVariant] = useState<BadgeVariant>('success');
  const [badgeDot, setBadgeDot] = useState(true);

  return (
    <div className="space-y-10">
      {/* 1. BUTTONS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="font-outfit text-lg font-bold text-white">1. Reusable Button System (`Button.tsx`)</h3>
            <p className="text-xs text-zinc-400">Multi-variant, loading spinner, spring animations, and icon slots</p>
          </div>
        </div>

        {/* Live Playground Controls */}
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-wrap items-center gap-4 text-xs text-zinc-300">
          <label className="flex items-center gap-2">
            <span className="font-semibold text-zinc-400">Variant:</span>
            <select
              value={btnVariant}
              onChange={(e) => setBtnVariant(e.target.value as ButtonVariant)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-white focus:outline-none"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
              <option value="danger">Danger</option>
              <option value="glow">Glow (Gradient)</option>
              <option value="link">Link</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="font-semibold text-zinc-400">Size:</span>
            <select
              value={btnSize}
              onChange={(e) => setBtnSize(e.target.value as ButtonSize)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-white focus:outline-none"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={btnLoading}
              onChange={(e) => setBtnLoading(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-800 text-indigo-600"
            />
            <span>Simulate Loading</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={btnPulse}
              onChange={(e) => setBtnPulse(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-800 text-indigo-600"
            />
            <span>Pulse Effect</span>
          </label>
        </div>

        {/* Live Preview Container */}
        <div className="p-8 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl flex items-center justify-center gap-4 flex-wrap">
          <Button
            variant={btnVariant}
            size={btnSize}
            isLoading={btnLoading}
            pulse={btnPulse}
            leftIcon={<Sparkles className="w-4 h-4" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Interactive Button
          </Button>

          <Button variant="secondary" size={btnSize} leftIcon={<Download className="w-4 h-4" />}>
            Download
          </Button>

          <Button variant="danger" size={btnSize} leftIcon={<Trash2 className="w-4 h-4" />}>
            Delete SKU
          </Button>
        </div>
      </section>

      {/* 2. INPUTS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="font-outfit text-lg font-bold text-white">2. Form Input (`Input.tsx`)</h3>
            <p className="text-xs text-zinc-400">Left/right icon slots, clearable buttons, and password visibility toggle</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Work Email Address"
            placeholder="architect@apex.io"
            leftIcon={<Mail className="w-4 h-4" />}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (e.target.value && !e.target.value.includes('@')) {
                setInputError('Must be a valid email format');
              } else {
                setInputError('');
              }
            }}
            isClearable
            onClear={() => setInputValue('')}
            error={inputError}
            variant="glass"
          />

          <Input
            label="Master Key Password"
            type="password"
            placeholder="Enter secure password"
            leftIcon={<Lock className="w-4 h-4" />}
            defaultValue="SuperSecretPass123"
            variant="glass"
          />
        </div>
      </section>

      {/* 3. BADGES SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="font-outfit text-lg font-bold text-white">3. Status Badges (`Badge.tsx`)</h3>
            <p className="text-xs text-zinc-400">Status colors with live pinging dots and optional remove tag button</p>
          </div>
        </div>

        <div className="p-6 bg-zinc-950/80 border border-zinc-800 rounded-2xl flex items-center gap-3 flex-wrap">
          <Badge variant="success" dot pulseDot>
            Live Server Active
          </Badge>
          <Badge variant="warning" dot pulseDot>
            Low Inventory Warning
          </Badge>
          <Badge variant="error" dot pulseDot>
            POS Terminal Offline
          </Badge>
          <Badge variant="info" dot>
            Syncing Ledger
          </Badge>
          <Badge variant="purple" size="md">
            v2.4.0 Release
          </Badge>
          <Badge variant="accent" onRemove={() => alert('Tag removed')}>
            Removable Filter Tag
          </Badge>
        </div>
      </section>

      {/* 4. CARDS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="font-outfit text-lg font-bold text-white">4. Glassmorphic Card Wrappers (`Card.tsx`)</h3>
            <p className="text-xs text-zinc-400">Structured layout with compound Header, Title, Content, and Footer components</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card variant="glass" hoverGlow>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Enterprise Telemetry</CardTitle>
                <Badge variant="success" size="sm">
                  Active
                </Badge>
              </div>
              <CardDescription>Real-time analytics pipeline monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-400">Requests / Sec:</span>
                <span className="font-mono font-bold text-white">48,920 req/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Average Latency:</span>
                <span className="font-mono font-bold text-emerald-400">12.4ms</span>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <span className="text-[11px] text-zinc-500">Updated 2 seconds ago</span>
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Details
              </Button>
            </CardFooter>
          </Card>

          <Card variant="interactive">
            <CardHeader>
              <CardTitle>POS Terminal #04</CardTitle>
              <CardDescription>Main Street Branch Register</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-zinc-300">
              <p>Connected to wireless thermal printer & barcode scanner.</p>
            </CardContent>
            <CardFooter>
              <Button variant="primary" size="sm" className="w-full">
                Launch Terminal
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
};
