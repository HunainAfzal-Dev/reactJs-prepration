import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Command, CornerDownLeft, Mic, MicOff, Search, Sparkles, X } from "lucide-react"
import { toast } from "../hooks/use-toast"
import { cn } from "../lib/utils"

interface CommandBarProps {
  onSearch?: (term: string) => void
  onVoiceTrigger?: () => void
}

export function CommandBar({ onSearch, onVoiceTrigger }: CommandBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestions = [
    { label: "/check-stock", description: "Search current inventory levels" },
    { label: "/low-stock", description: "Filter items below threshold" },
    { label: "/add-item", description: "Register new item to POS" },
    { label: "/sales-report", description: "Generate daily transactions log" },
  ]

  // Listen for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === "Escape") {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setIsListening(false)
    }
  }, [isOpen])

  const handleMicClick = () => {
    if (isListening) {
      setIsListening(false)
      toast("Voice scan stopped", "AI voice system standby.", "info")
    } else {
      setIsListening(true)
      toast("Listening...", "Say command: 'Check stock levels' or 'Generate invoice'.", "ai")
      if (onVoiceTrigger) onVoiceTrigger()
      
      // Simulate voice input detection
      setTimeout(() => {
        setIsListening(false)
        setInput("/low-stock")
        inputRef.current?.focus()
        toast("Voice input processed", "Autofilled AI prompt bar.", "success")
      }, 3500)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    inputRef.current?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    toast("Processing Command", `AI executing: "${input}"`, "ai")
    if (onSearch) onSearch(input)
    setInput("")
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Spotlight Prompt Trigger Button */}
      <div className="flex justify-center p-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 bg-zinc-950 border border-white/10 hover:border-indigo-500/40 hover:text-white transition-all shadow-lg shadow-black/40"
        >
          <Command className="h-4 w-4 text-zinc-500" />
          <span>Search with AI...</span>
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/10 bg-zinc-900 px-1.5 font-mono text-[10px] font-bold text-zinc-500">
            Ctrl + K
          </kbd>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Spotlight Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "relative z-10 w-full max-w-xl rounded-2xl glass-card overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10",
                isListening && "border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.25)] animate-pulse-slow"
              )}
            >
              {/* Form Input Section */}
              <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                <Search className="h-5 w-5 text-zinc-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Listening to voice input..." : "Type inventory commands or ask AI..."}
                  className="flex-grow bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none"
                  disabled={isListening}
                />
                
                {/* Voice button */}
                <button
                  type="button"
                  onClick={handleMicClick}
                  className={cn(
                    "p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors relative flex items-center justify-center",
                    isListening ? "bg-indigo-600 text-white" : "hover:bg-white/5"
                  )}
                  title="Voice command scan"
                >
                  {isListening ? (
                    <>
                      <Mic className="h-4.5 w-4.5 animate-pulse" />
                      <span className="absolute inset-0 rounded-lg border border-indigo-400 scale-125 opacity-0 animate-ping" />
                    </>
                  ) : (
                    <Mic className="h-4.5 w-4.5" />
                  )}
                </button>

                <div className="flex items-center gap-1 text-[10px] font-bold font-mono text-zinc-500 bg-zinc-900 border border-white/5 px-2 py-1 rounded">
                  <span>ENTER</span>
                  <CornerDownLeft className="h-2.5 w-2.5" />
                </div>
              </form>

              {/* Suggestions Section */}
              <div className="p-4 bg-zinc-950/40">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-3.5">
                  Suggested Commands
                </span>
                
                <div className="flex flex-col gap-1">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.label}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion.label)}
                      className="flex items-center justify-between w-full p-2.5 rounded-xl hover:bg-white/5 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="h-4 w-4 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-sm font-semibold text-white">{suggestion.label}</span>
                      </div>
                      <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                        {suggestion.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
