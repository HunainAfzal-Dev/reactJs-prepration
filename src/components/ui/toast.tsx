import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, CheckCircle2, Info, Sparkles, X } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import type { ToastItem } from "../../hooks/use-toast"
import { cn } from "../../lib/utils"

export function ToastProvider() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-3 p-4 md:bottom-6 md:right-6 pointer-events-none">
      <div className="flex flex-col gap-3 w-full pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {toasts.map((item) => (
            <Toast key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface ToastProps {
  item: ToastItem
  onDismiss: () => void
}

function Toast({ item, onDismiss }: ToastProps) {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500" />,
    info: <Info className="h-5 w-5 text-zinc-400" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
    ai: <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />,
  }

  const borderStyles = {
    success: "border-emerald-500/20 bg-emerald-950/20",
    error: "border-rose-500/20 bg-rose-950/20",
    info: "border-zinc-800 bg-zinc-950/40",
    warning: "border-amber-500/20 bg-amber-950/20",
    ai: "border-indigo-500/30 bg-indigo-950/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]",
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md",
        borderStyles[item.type]
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[item.type]}</div>

      <div className="flex-grow flex flex-col gap-0.5">
        <h4 className="text-sm font-semibold text-white">{item.title}</h4>
        {item.description && (
          <p className="text-xs text-zinc-400 leading-normal">
            {item.description}
          </p>
        )}
      </div>

      <button
        onClick={onDismiss}
        className="flex-shrink-0 rounded-lg p-1 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
