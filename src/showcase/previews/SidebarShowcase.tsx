import React, { useState } from 'react';
import { Sidebar, SidebarItem } from '../../components/complex/Sidebar';
import { Badge } from '../../components/ui/Badge';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  FolderTree,
  Bell,
} from 'lucide-react';

const MOCK_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard Overview',
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    id: 'inventory',
    label: 'Inventory Engine',
    icon: <Package className="w-4 h-4" />,
    badge: '14 Low',
    badgeVariant: 'warning',
    children: [
      { id: 'all-products', label: 'All Products SKU', badge: '1,420' },
      { id: 'stock-audit', label: 'Stock Audit Log' },
      { id: 'suppliers', label: 'Suppliers Catalog' },
    ],
  },
  {
    id: 'pos-orders',
    label: 'POS Register',
    icon: <ShoppingCart className="w-4 h-4" />,
    badge: '3 Active',
    badgeVariant: 'success',
  },
  {
    id: 'customers',
    label: 'Customer Accounts',
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: 'analytics',
    label: 'Financial Reports',
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: 'settings',
    label: 'System Settings',
    icon: <Settings className="w-4 h-4" />,
  },
];

export const SidebarShowcase: React.FC = () => {
  const [activeId, setActiveId] = useState('all-products');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
        <div>
          <h3 className="font-outfit text-lg font-bold text-white">
            Adaptive Collapsible Sidebar (`Sidebar.tsx`)
          </h3>
          <p className="text-xs text-zinc-400">
            Multi-level menu support with active layout animation and collapsed hover-to-expand popovers.
          </p>
        </div>
        <Badge variant="info">Collapsible & Floating Popovers</Badge>
      </div>

      {/* Control Bar */}
      <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-between text-xs text-zinc-300">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-zinc-400">Sidebar Mode:</span>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-medium hover:bg-zinc-800 transition-colors"
          >
            Toggle {isCollapsed ? 'Expand (270px)' : 'Collapse (80px)'}
          </button>
        </div>

        <div>
          Selected Route:{' '}
          <span className="font-mono font-bold text-indigo-400">{activeId}</span>
        </div>
      </div>

      {/* Live Preview Wrapper */}
      <div className="h-[520px] bg-zinc-950/80 border border-zinc-800/80 rounded-3xl overflow-hidden flex relative">
        <Sidebar
          items={MOCK_SIDEBAR_ITEMS}
          activeId={activeId}
          onSelect={(id) => setActiveId(id)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Dummy Main Content View */}
        <div className="flex-1 p-8 bg-zinc-900/30 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-outfit text-white capitalize">
              Active View: {activeId.replace('-', ' ')}
            </h2>
            <Badge variant="purple">Isolated Component Environment</Badge>
          </div>
          <p className="text-xs text-zinc-400">
            Clicking on any sidebar item updates the active routing state smoothly. Notice the sliding background pill on top-level items and parent dropdown toggles.
          </p>

          <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
            <div className="text-xs font-semibold text-zinc-300">Active Props Passed:</div>
            <pre className="text-[11px] font-mono text-emerald-400 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 overflow-x-auto">
{JSON.stringify({ activeId, isCollapsed }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
