import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, KeyRound, Lock, Mail, ShieldAlert, Sparkles } from "lucide-react"
import { toast } from "../hooks/use-toast"
import { cn } from "../lib/utils"

export function LoginCard() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [token, setToken] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Magnetic hover states
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || isExpanded) return
    const { clientX, clientY } = e
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect()
    const x = clientX - (left + width / 2)
    const y = clientY - (top + height / 2)
    // cap values to moderate magnetic strength
    setMousePos({ x: x * 0.35, y: y * 0.35 })
  }

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !token) {
      toast("Authentication Failed", "All fields including the AI token are required.", "error")
      return
    }
    setIsSubmitting(true)
    toast("Syncing Credentials", "Connecting to security node...", "ai")
    
    setTimeout(() => {
      setIsSubmitting(false)
      setIsExpanded(false)
      toast("Access Granted", "Logged in to AI Inventory Terminal.", "success")
    }, 1500)
  }

  return (
    <div className="flex items-center justify-center p-4">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className={cn(
          "relative overflow-hidden glass-card shadow-2xl transition-all duration-300",
          isExpanded ? "w-full max-w-[400px] p-8 rounded-2xl" : "p-1 rounded-full"
        )}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.button
              key="trigger-button"
              ref={buttonRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => setIsExpanded(true)}
              animate={{ x: mousePos.x, y: mousePos.y }}
              transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
              className={cn(
                "group relative flex items-center gap-3 px-6 py-3.5 rounded-full font-medium text-sm tracking-wide text-white bg-zinc-950 transition-all duration-300",
                "border border-white/10 hover:border-indigo-500/50 shadow-inner",
                "before:absolute before:inset-0 before:rounded-full before:-z-10 before:bg-gradient-to-r before:from-indigo-600/30 before:to-emerald-600/30 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:blur-md"
              )}
            >
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full border border-indigo-500/20 group-hover:scale-105 group-hover:opacity-100 transition-all opacity-0 blur-sm" />
              <Lock className="h-4.5 w-4.5 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
              <span>Access AI Terminal</span>
              <Sparkles className="h-4.5 w-4.5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
            </motion.button>
          ) : (
            <motion.div
              key="login-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="flex flex-col gap-1.5 mb-6 text-center">
                <div className="mx-auto bg-indigo-500/10 p-3 rounded-full border border-indigo-500/20 mb-2">
                  <KeyRound className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white">Unlock Secure Vault</h3>
                <p className="text-xs text-zinc-400">Initialize AI Inventory Core Engine</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 h-4.5 w-4.5 text-zinc-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@inventory.ai"
                      className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-950/60 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 h-4.5 w-4.5 text-zinc-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2 text-sm bg-zinc-950/60 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                      AI Assistant Token
                    </label>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                      Active Shield
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <Sparkles className="absolute left-3.5 h-4.5 w-4.5 text-zinc-500" />
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="AI_SECURE_KEY_..."
                      className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-950/60 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-grow py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Synchronizing...</span>
                      </>
                    ) : (
                      <>
                        <span>Authenticate</span>
                        <Sparkles className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
