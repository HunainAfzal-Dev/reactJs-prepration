import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronDown, 
  ChevronRight, 
  Database, 
  LayoutDashboard, 
  Menu, 
  Mic, 
  Plus, 
  Receipt, 
  Settings, 
  TrendingUp 
} from "lucide-react"
import { cn } from "../lib/utils"

interface SubItem {
  label: string
  onClick?: () => void
}

interface MenuItem {
  label: string
  icon: React.ComponentType<any>
  subItems?: SubItem[]
  onClick?: () => void
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({})
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [activeItem, setActiveItem] = useState("Dashboard")

  const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => setActiveItem("Dashboard"),
    },
    {
      label: "Inventory",
      icon: Database,
      subItems: [
        { label: "Stock Levels" },
        { label: "Categories" },
        { label: "Suppliers" },
      ],
    },
    {
      label: "POS System",
      icon: Receipt,
      subItems: [
        { label: "New Sale" },
        { label: "Transactions History" },
      ],
    },
    {
      label: "AI Voice Core",
      icon: Mic,
      subItems: [
        { label: "Voice Prompts" },
        { label: "Speech Settings" },
      ],
    },
    {
      label: "Reports",
      icon: TrendingUp,
      subItems: [
        { label: "Sales Analytics" },
        { label: "Stock Forecasts" },
      ],
    },
  ]

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  return (
    <motion.div
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ type: "spring", stiffness: 250, damping: 26 }}
      className={cn(
        "h-screen sticky top-0 left-0 bg-zinc-950/80 border-r border-white/10 flex flex-col justify-between py-6 z-40 backdrop-blur-md",
        "shadow-2xl"
      )}
    >
      <div className="flex flex-col gap-8 w-full px-3">
        {/* Logo Section */}
        <div className={cn("flex items-center justify-between px-2", isCollapsed && "justify-center")}>
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2.5"
              >
                <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                  <Database className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="font-bold text-base tracking-wide bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  InvenTory<span className="text-indigo-400">.AI</span>
                </span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]"
              >
                <Database className="h-4.5 w-4.5 text-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapse Trigger Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors hidden md:block"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex flex-col gap-1 w-full">
          {menuItems.map((item) => {
            const Icon = item.icon
            const hasSubItems = !!item.subItems
            const isDropdownOpen = openDropdowns[item.label]
            const isHovered = hoveredItem === item.label
            const isItemActive = activeItem === item.label || item.subItems?.some(s => activeItem === s.label)

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => isCollapsed && setHoveredItem(item.label)}
                onMouseLeave={() => isCollapsed && setHoveredItem(null)}
              >
                {/* Main Item Row */}
                <button
                  onClick={() => {
                    if (isCollapsed) return
                    if (hasSubItems) {
                      toggleDropdown(item.label)
                    } else if (item.onClick) {
                      item.onClick()
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group duration-200",
                    isItemActive
                      ? "text-white bg-indigo-600/10 border-l-2 border-indigo-500"
                      : "text-zinc-400 hover:text-white hover:bg-white/5",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-105",
                    isItemActive ? "text-indigo-400" : "text-zinc-400 group-hover:text-zinc-200"
                  )} />

                  {!isCollapsed && (
                    <span className="flex-grow text-left">{item.label}</span>
                  )}

                  {!isCollapsed && hasSubItems && (
                    <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      {isDropdownOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </button>

                {/* Sub Menu Dropdown (Expanded Mode) */}
                {!isCollapsed && hasSubItems && isDropdownOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden flex flex-col gap-0.5 pl-9 mt-1 border-l border-white/5 ml-5"
                  >
                    {item.subItems?.map((sub) => (
                      <button
                        key={sub.label}
                        onClick={() => {
                          setActiveItem(sub.label)
                          if (sub.onClick) sub.onClick()
                        }}
                        className={cn(
                          "w-full text-left py-2 px-3 text-xs rounded-lg transition-colors font-medium",
                          activeItem === sub.label
                            ? "text-indigo-400 bg-indigo-500/5"
                            : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                        )}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Hover Flyout (Collapsed Mode) */}
                <AnimatePresence>
                  {isCollapsed && hasSubItems && isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, y: -10 }}
                      animate={{ opacity: 1, x: 0, y: -10 }}
                      exit={{ opacity: 0, x: 10, y: -10 }}
                      className="absolute left-full top-0 ml-3 w-48 rounded-xl border border-white/10 bg-zinc-950 p-2 shadow-2xl z-50 glass-card"
                    >
                      <div className="px-3 py-1.5 border-b border-white/5 mb-1.5">
                        <span className="text-xs font-semibold text-white tracking-wide uppercase">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {item.subItems?.map((sub) => (
                          <button
                            key={sub.label}
                            onClick={() => {
                              setActiveItem(sub.label)
                              setIsCollapsed(false)
                              setOpenDropdowns(prev => ({ ...prev, [item.label]: true }))
                              if (sub.onClick) sub.onClick()
                            }}
                            className={cn(
                              "w-full text-left py-2 px-3 text-xs rounded-lg transition-colors font-medium",
                              activeItem === sub.label
                                ? "text-indigo-400 bg-indigo-500/5"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </nav>
      </div>

      {/* Footer Profile Section */}
      <div className={cn("px-4 border-t border-white/5 pt-4 flex items-center gap-3", isCollapsed && "justify-center px-0")}>
        <div className="relative h-9 w-9 rounded-full bg-zinc-800 border border-white/10 flex-shrink-0 flex items-center justify-center font-bold text-sm text-indigo-400 shadow-md">
          XD
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border border-zinc-950 rounded-full animate-pulse" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-white tracking-wide leading-none truncate">XD Dev</span>
            <span className="text-[10px] text-zinc-500 truncate mt-0.5">System Architect</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
