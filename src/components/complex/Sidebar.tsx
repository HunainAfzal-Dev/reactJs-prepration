import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Sparkles,
  Settings,
  UserCheck,
} from 'lucide-react';
import { Badge, BadgeVariant } from '../ui/Badge';
import { cn } from '../../lib/utils';

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeVariant?: BadgeVariant;
  children?: SidebarItem[];
}

export interface SidebarUserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  status?: 'online' | 'busy' | 'away' | 'offline';
}

export interface SidebarProps {
  items: SidebarItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  userProfile?: SidebarUserProfile;
  brandTitle?: string;
  brandLogo?: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeId = 'dashboard',
  onSelect,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
  userProfile = {
    name: 'Sarah Connor',
    email: 'sarah@cyberdyne.io',
    status: 'online',
  },
  brandTitle = 'Apex Studio',
  brandLogo = <Sparkles className="w-5 h-5 text-indigo-400" />,
  className,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = controlledCollapsed ?? internalCollapsed;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((prev) => !prev);
    }
  };

  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({
    inventory: true,
  });

  const [hoveredCollapsedItem, setHoveredCollapsedItem] = useState<string | null>(null);

  const toggleParent = (id: string) => {
    setExpandedParents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 270 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'h-full bg-zinc-950/95 border-r border-zinc-800/80 flex flex-col justify-between p-3 relative select-none z-30 shadow-2xl backdrop-blur-xl',
        className
      )}
    >
      {/* Top Header: Brand & Collapse Toggle */}
      <div>
        <div className="flex items-center justify-between pb-4 pt-1 px-2 border-b border-zinc-800/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              {brandLogo}
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col whitespace-nowrap overflow-hidden"
              >
                <span className="font-outfit font-bold text-sm text-white">{brandTitle}</span>
                <span className="text-[10px] text-zinc-400 font-mono tracking-wider">ENTERPRISE OS</span>
              </motion.div>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggle}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors shrink-0"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="mt-4 space-y-1">
          {items.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isParentExpanded = !!expandedParents[item.id];
            const isChildActive =
              hasChildren && item.children?.some((child) => child.id === activeId);
            const isItemActive = item.id === activeId || isChildActive;

            return (
              <div key={item.id} className="relative">
                {/* Main Item Row */}
                <div
                  onMouseEnter={() => isCollapsed && setHoveredCollapsedItem(item.id)}
                  onMouseLeave={() => isCollapsed && setHoveredCollapsedItem(null)}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (hasChildren && !isCollapsed) {
                        toggleParent(item.id);
                      } else {
                        onSelect?.(item.id);
                      }
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative',
                      isItemActive && !hasChildren
                        ? 'text-white'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                    )}
                  >
                    {/* Active Sliding Pill (for non-parent items) */}
                    {item.id === activeId && (
                      <motion.div
                        layoutId="sidebar-active-pill"
                        className="absolute inset-0 bg-indigo-600/90 rounded-xl shadow-md"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    <div className="flex items-center gap-3 relative z-10 overflow-hidden">
                      <span
                        className={cn(
                          'w-5 h-5 flex items-center justify-center shrink-0 transition-colors',
                          isItemActive ? 'text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-200'
                        )}
                      >
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className="truncate whitespace-nowrap">{item.label}</span>
                      )}
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center gap-2 relative z-10 shrink-0">
                        {item.badge && (
                          <Badge variant={item.badgeVariant || 'neutral'} size="sm">
                            {item.badge}
                          </Badge>
                        )}
                        {hasChildren && (
                          <span className="text-zinc-500 group-hover:text-zinc-300">
                            {isParentExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </button>

                  {/* Floating Popover Submenu when Collapsed */}
                  {isCollapsed && hasChildren && hoveredCollapsedItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="absolute left-full top-0 ml-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl p-2 shadow-2xl z-50 space-y-1"
                    >
                      <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 border-b border-zinc-800">
                        {item.label}
                      </div>
                      {item.children?.map((child) => (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => onSelect?.(child.id)}
                          className={cn(
                            'w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between',
                            child.id === activeId
                              ? 'bg-indigo-600 text-white font-medium'
                              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                          )}
                        >
                          <span>{child.label}</span>
                          {child.badge && (
                            <Badge variant={child.badgeVariant || 'neutral'} size="sm">
                              {child.badge}
                            </Badge>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Expanded Sub-items List (when open & expanded mode) */}
                {!isCollapsed && hasChildren && isParentExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-5 pl-3 border-l border-zinc-800/80 my-1 space-y-1"
                  >
                    {item.children?.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => onSelect?.(child.id)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors relative group',
                          child.id === activeId
                            ? 'text-indigo-400 font-semibold bg-indigo-500/10 border border-indigo-500/20'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                        )}
                      >
                        <span className="truncate">{child.label}</span>
                        {child.badge && (
                          <Badge variant={child.badgeVariant || 'neutral'} size="sm">
                            {child.badge}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="pt-3 border-t border-zinc-800/60">
        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-900 transition-colors">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                {userProfile.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  userProfile.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                )}
              </div>
              <span
                className={cn(
                  'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-zinc-950',
                  userProfile.status === 'online' && 'bg-emerald-400',
                  userProfile.status === 'busy' && 'bg-rose-400',
                  userProfile.status === 'away' && 'bg-amber-400',
                  userProfile.status === 'offline' && 'bg-zinc-500'
                )}
              />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold text-white truncate">{userProfile.name}</span>
                <span className="text-[10px] text-zinc-400 truncate">{userProfile.email}</span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
                title="Account Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="p-1 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-800"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
