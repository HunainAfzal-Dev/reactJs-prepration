import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Receipt,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export interface CartItem {
  id: string;
  title: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  items: CartItem[];
  onUpdateQuantity?: (id: string, newQty: number) => void;
  onRemoveItem?: (id: string) => void;
  onClearCart?: () => void;
  onCheckoutComplete?: (details: { total: number; orderId: string }) => void;
  taxRate?: number;
  className?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen = true,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckoutComplete,
  taxRate = 0.08,
  className,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  // Checkout State Machine
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'processing' | 'success'>('idle');
  const [lastOrderId, setLastOrderId] = useState('');

  // Computations
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const grandTotal = Math.max(0, subtotal + tax - discount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'APEX10') {
      setDiscount(subtotal * 0.1);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try "APEX10"');
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    setCheckoutStep('processing');
    const mockOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    setTimeout(() => {
      setCheckoutStep('success');
      setLastOrderId(mockOrderId);

      setTimeout(() => {
        onCheckoutComplete?.({ total: grandTotal, orderId: mockOrderId });
      }, 1500);
    }, 1800);
  };

  const resetCheckout = () => {
    setCheckoutStep('idle');
    setLastOrderId('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Slide-over Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className={cn(
                'w-screen max-w-md bg-zinc-950/95 border-l border-zinc-800 text-zinc-100 flex flex-col shadow-2xl backdrop-blur-2xl relative',
                className
              )}
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-outfit font-bold text-lg text-white">POS Order Drawer</h3>
                    <p className="text-xs text-zinc-400">
                      {items.length} {items.length === 1 ? 'item' : 'items'} in current session
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {items.length > 0 && checkoutStep === 'idle' && (
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="p-2 text-zinc-400 hover:text-rose-400 text-xs font-medium rounded-lg hover:bg-zinc-900 transition-colors"
                      title="Clear Cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Main Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* CHECKOUT SUCCESS SCREEN */}
                {checkoutStep === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-500/20 animate-bounce">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <div>
                      <h4 className="text-2xl font-bold text-white font-outfit">Payment Completed!</h4>
                      <p className="text-xs text-zinc-400 mt-1">Transaction recorded to POS ledger</p>
                    </div>

                    <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl w-full max-w-xs space-y-2 text-xs">
                      <div className="flex justify-between text-zinc-400">
                        <span>Receipt ID:</span>
                        <span className="font-mono text-zinc-200 font-bold">{lastOrderId}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Total Paid:</span>
                        <span className="font-bold text-emerald-400">${grandTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button variant="secondary" size="md" onClick={resetCheckout} className="mt-4">
                      Start New Transaction
                    </Button>
                  </motion.div>
                ) : items.length === 0 ? (
                  /* EMPTY CART SCREEN */
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-semibold text-zinc-300">Your POS drawer is empty</h4>
                    <p className="text-xs text-zinc-500 max-w-xs">
                      Select inventory items from the product catalog to begin checkout.
                    </p>
                  </div>
                ) : (
                  /* ITEMS LIST */
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="p-3 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl flex items-center gap-3 group hover:border-zinc-700/80 transition-all"
                        >
                          {/* Item Thumbnail */}
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-14 h-14 rounded-xl object-cover border border-zinc-800 shrink-0 bg-zinc-950"
                            />
                          )}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                            <span className="text-[10px] font-mono text-zinc-500">SKU: {item.sku}</span>
                            <div className="text-xs font-bold text-indigo-400 mt-1">
                              ${item.price.toFixed(2)}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-xl p-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity?.(item.id, item.quantity - 1)}
                              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold font-mono px-1.5 text-zinc-200">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => onRemoveItem?.(item.id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition-colors shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Drawer Footer (Summary & Checkout CTA) */}
              {items.length > 0 && checkoutStep !== 'success' && (
                <div className="p-5 bg-zinc-950 border-t border-zinc-800/80 space-y-4">
                  {/* Promo Input */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder='Promo (try "APEX10")'
                      disabled={promoApplied}
                      className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 uppercase font-mono"
                    />
                    <Button type="submit" variant="secondary" size="sm" disabled={promoApplied}>
                      {promoApplied ? 'Applied' : 'Apply'}
                    </Button>
                  </form>
                  {promoError && <p className="text-[11px] text-rose-400 font-medium">{promoError}</p>}

                  {/* Calculations breakdown */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal</span>
                      <span className="font-mono text-zinc-200">${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount (10%)</span>
                        <span className="font-mono">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-zinc-400">
                      <span>Estimated Tax (8%)</span>
                      <span className="font-mono text-zinc-200">${tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-zinc-800">
                      <span>Grand Total</span>
                      <span className="text-base font-outfit text-indigo-400 font-extrabold">
                        ${grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <Button
                    type="button"
                    variant="glow"
                    size="lg"
                    isLoading={checkoutStep === 'processing'}
                    onClick={handleCheckout}
                    className="w-full shadow-indigo-600/30"
                    leftIcon={<CreditCard className="w-4 h-4" />}
                  >
                    {checkoutStep === 'processing' ? 'Processing POS Payment...' : 'Charge POS Order'}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
