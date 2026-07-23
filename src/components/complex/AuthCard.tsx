import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, ArrowRight, X, Sparkles, CheckCircle2, Github } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

export interface AuthCardProps {
  brandName?: string;
  brandLogo?: React.ReactNode;
  initialMode?: 'login' | 'register';
  onLoginSuccess?: (data: { email: string }) => void;
  onRegisterSuccess?: (data: { name: string; email: string }) => void;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  brandName = 'Apex Cloud',
  brandLogo = <Sparkles className="w-5 h-5 text-indigo-400" />,
  initialMode = 'login',
  onLoginSuccess,
  onRegisterSuccess,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('alex.architect@dev.io');
  const [password, setPassword] = useState('••••••••••••');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (mode === 'register' && !name.trim()) errs.name = 'Full name is required';
    if (!email.includes('@')) errs.email = 'Please enter a valid email';
    if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setIsExpanded(false);
        if (mode === 'login') {
          onLoginSuccess?.({ email });
        } else {
          onRegisterSuccess?.({ name, email });
        }
      }, 1200);
    }, 1500);
  };

  return (
    <div className={cn('relative flex items-center justify-center p-4', className)}>
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* COLLAPSED MAGNETIC GLOWING BUTTON */
          <motion.div
            key="auth-button"
            layoutId="auth-card-container"
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="relative group"
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70 blur-md group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse-slow" />
            <motion.button
              type="button"
              onClick={() => setIsExpanded(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="relative px-7 py-4 bg-zinc-950 border border-white/15 rounded-2xl text-white font-medium flex items-center gap-3 shadow-2xl backdrop-blur-xl hover:bg-zinc-900 transition-colors"
            >
              <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                {brandLogo}
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-semibold tracking-wide text-white">Access Portal</span>
                <span className="text-xs text-zinc-400">Click to expand sign-in form</span>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-400 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        ) : (
          /* EXPANDED MORPHED AUTH CARD */
          <motion.div
            key="auth-modal"
            layoutId="auth-card-container"
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="w-full max-w-md bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header & Close Action */}
            <div className="flex items-center justify-between pb-5 border-b border-zinc-800/60 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                  {brandLogo}
                </div>
                <div>
                  <h3 className="font-outfit font-bold text-white text-lg leading-tight">{brandName}</h3>
                  <p className="text-xs text-zinc-400">Secure Authentication Engine</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success State Overlay */}
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-3"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white font-outfit">Authenticated Successfully!</h4>
                <p className="text-xs text-zinc-400">Welcome back to {brandName}. Redirecting...</p>
              </motion.div>
            ) : (
              <div className="pt-5 space-y-5 relative z-10">
                {/* Tab Pill Switcher */}
                <div className="relative p-1 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrors({});
                    }}
                    className={cn(
                      'relative flex-1 py-2 text-xs font-semibold rounded-xl transition-colors z-10',
                      mode === 'login' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                    )}
                  >
                    {mode === 'login' && (
                      <motion.div
                        layoutId="auth-tab-pill"
                        className="absolute inset-0 bg-indigo-600/90 rounded-xl shadow-md"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">Sign In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrors({});
                    }}
                    className={cn(
                      'relative flex-1 py-2 text-xs font-semibold rounded-xl transition-colors z-10',
                      mode === 'register' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                    )}
                  >
                    {mode === 'register' && (
                      <motion.div
                        layoutId="auth-tab-pill"
                        className="absolute inset-0 bg-indigo-600/90 rounded-xl shadow-md"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">Create Account</span>
                  </button>
                </div>

                {/* Social Auth Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setIsLoading(false);
                        setIsSuccess(true);
                        setTimeout(() => setIsExpanded(false), 1000);
                      }, 1000);
                    }}
                    className="py-2.5 px-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 rounded-xl text-xs text-zinc-300 font-medium flex items-center justify-center gap-2 transition-all"
                  >
                    <Github className="w-4 h-4 text-zinc-100" />
                    GitHub
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => {
                        setIsLoading(false);
                        setIsSuccess(true);
                        setTimeout(() => setIsExpanded(false), 1000);
                      }, 1000);
                    }}
                    className="py-2.5 px-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 rounded-xl text-xs text-zinc-300 font-medium flex items-center justify-center gap-2 transition-all"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9 shadow-none"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
                      />
                    </svg>
                    Google
                  </button>
                </div>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-zinc-800 w-full" />
                  <span className="absolute bg-zinc-950 px-3 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                    or continue with
                  </span>
                </div>

                {/* Auth Form Inputs */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <AnimatePresence mode="popLayout">
                    {mode === 'register' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Input
                          label="Full Name"
                          placeholder="Alex Architect"
                          leftIcon={<User className="w-4 h-4" />}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          error={errors.name}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Input
                    label="Work Email"
                    type="email"
                    placeholder="alex@company.com"
                    leftIcon={<Mail className="w-4 h-4" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                  />

                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    leftIcon={<Lock className="w-4 h-4" />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                  />

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-zinc-800 bg-zinc-900 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Remember credentials</span>
                    </label>
                    {mode === 'login' && (
                      <a href="#forgot" className="text-xs text-indigo-400 hover:underline">
                        Forgot password?
                      </a>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="glow"
                    size="lg"
                    isLoading={isLoading}
                    className="w-full mt-2"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {mode === 'login' ? 'Sign In to Workspace' : 'Create Free Account'}
                  </Button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
