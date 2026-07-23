import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Edit3, Trash2, AlertTriangle, CheckCircle, PackageX, Tag } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

export interface ProductCardProps {
  id: string;
  title: string;
  sku: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  category?: string;
  image?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  sku,
  price,
  stockQuantity,
  lowStockThreshold = 10,
  category = 'Hardware',
  image = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
  onEdit,
  onDelete,
  onAddToCart,
  className,
}) => {
  const isOutOfStock = stockQuantity === 0;
  const isLowStock = !isOutOfStock && stockQuantity <= lowStockThreshold;

  // Max threshold reference for progress bar
  const maxCapacity = Math.max(stockQuantity, 50);
  const stockPercentage = Math.min(Math.round((stockQuantity / maxCapacity) * 100), 100);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={cn(
        'group relative bg-zinc-950/90 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl hover:border-zinc-700/80 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between',
        className
      )}
    >
      {/* Top Media & Floating Status Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />

        {/* Category & Status Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <Badge variant="purple" size="sm" className="bg-zinc-900/80 backdrop-blur-md">
            <Tag className="w-3 h-3 mr-1" />
            {category}
          </Badge>

          {isOutOfStock ? (
            <Badge variant="error" size="sm" dot pulseDot>
              <PackageX className="w-3 h-3 mr-1" /> Out of Stock
            </Badge>
          ) : isLowStock ? (
            <Badge variant="warning" size="sm" dot pulseDot>
              <AlertTriangle className="w-3 h-3 mr-1" /> Low Stock
            </Badge>
          ) : (
            <Badge variant="success" size="sm" dot>
              <CheckCircle className="w-3 h-3 mr-1" /> In Stock
            </Badge>
          )}
        </div>

        {/* Quick Hover Actions Overlay */}
        <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-20">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(id)}
              className="p-2.5 bg-zinc-900/90 hover:bg-indigo-600 text-white rounded-xl border border-zinc-700/80 hover:border-indigo-500 shadow-lg transition-all scale-90 group-hover:scale-100"
              title="Edit SKU"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(id)}
              className="p-2.5 bg-zinc-900/90 hover:bg-rose-600 text-white rounded-xl border border-zinc-700/80 hover:border-rose-500 shadow-lg transition-all scale-90 group-hover:scale-100"
              title="Delete Item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">SKU: {sku}</span>
            <span className="text-base font-bold text-emerald-400 font-outfit">${price.toFixed(2)}</span>
          </div>

          <h4 className="text-sm font-semibold text-white font-outfit line-clamp-1 mt-1 group-hover:text-indigo-300 transition-colors">
            {title}
          </h4>
        </div>

        {/* Stock Level Indicator Bar */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-800/60">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-medium">Quantity in Warehouse:</span>
            <span
              className={cn(
                'font-mono font-bold text-xs',
                isOutOfStock ? 'text-rose-400' : isLowStock ? 'text-amber-400' : 'text-zinc-200'
              )}
            >
              {stockQuantity} units
            </span>
          </div>

          <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stockPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={cn(
                'h-full rounded-full transition-colors',
                isOutOfStock
                  ? 'bg-rose-500'
                  : isLowStock
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              )}
            />
          </div>
        </div>

        {/* Bottom Add to Cart POS Button */}
        <div className="pt-2">
          <Button
            type="button"
            variant={isOutOfStock ? 'secondary' : 'primary'}
            size="sm"
            disabled={isOutOfStock}
            onClick={() => onAddToCart?.(id)}
            className="w-full"
            leftIcon={<ShoppingCart className="w-4 h-4" />}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to POS Order'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
